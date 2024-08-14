import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import crypto from "crypto";
import { Request, Response } from "express";
import Item from "../models/itemModel.js";
import User from "../models/userModel.js";

import fs, { createReadStream } from "fs";
import path from "path";
import { promisify } from "util";

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION || "ap-south-1";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN;
const cloudFrontDistID = process.env.CLOUDFRONT_DIST_ID;

const transformBucketName = process.env.AWS_TRANSFORM_BUCKET_NAME;
const transformRegion = process.env.AWS_TRANSFORM_BUCKET_REGION || "ap-south-1";
const transformAccessKeyId = process.env.AWS_TRANSFORM_ACCESS_KEY_ID;
const transformSecretAccessKey = process.env.AWS_TRANSFORM_SECRET_ACCESS_KEY;

// console.log("bucketName:", bucketName);
// console.log("region:", region);
// console.log("accessKeyId:", accessKeyId);
// console.log("secretAccessKey:", secretAccessKey);
// console.log("transformBucketName:", transformBucketName);
// console.log("transformRegion:", transformRegion);
// console.log("transformAccessKeyId:", transformAccessKeyId);
// console.log("transformSecretAccessKey:", transformSecretAccessKey);

interface ImageDetail {
  url: string;
  key: string;
}

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
  },
  region: region,
});

const transformS3 = new S3Client({
  credentials: {
    accessKeyId: transformAccessKeyId!,
    secretAccessKey: transformSecretAccessKey!,
  },
  region: transformRegion,
});

const cloudFront = new CloudFrontClient({
  credentials: {
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
  },
});

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

// console.log(randomImageName(32));

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

const unlinkAsync = promisify(fs.unlink);

export const createItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const {
      title,
      description,
      price,
      room_no,
      hostel_no,
      year_of_purchase,
      category,
      contact_no,
    } = req.body;

    const existingItem = await Item.findOne({ title, seller: userId });
    if (existingItem) {
      return res
        .status(400)
        .json({ message: "You already have an item with this title" });
    }

    // Calculate total size
    const totalSize = (req.files as Express.Multer.File[]).reduce(
      (acc: number, file: Express.Multer.File) => acc + file.size,
      0
    );
    if (totalSize > MAX_FILE_SIZE) {
      return res
        .status(400)
        .json({ message: "Total file size exceeds the 25 MB limit." });
    }

    // Resize and upload each image
    const imageDetails = [];
    for (const file of req.files as Express.Multer.File[]) {
      const filePath = path.join("uploads", file.filename);

      //const buffer = await sharp(filePath).toFormat("webp").toBuffer();
      const imageName = randomImageName();
      const params = {
        Bucket: bucketName!,
        Key: imageName,
        Body: createReadStream(filePath),
        ContentType: file.mimetype,
      };
      const command = new PutObjectCommand(params);
      await s3.send(command);
      await unlinkAsync(filePath);
      imageDetails.push({ key: imageName });
    }

    const newItem = new Item({
      title,
      description,
      price,
      room_no,
      hostel_no,
      year_of_purchase,
      category,
      seller: userId,
      images: imageDetails,
      contact_no,
    });
    await newItem.save();

    await User.findByIdAndUpdate(userId, { $push: { items: newItem._id } });

    res.status(201).json({ message: "Item created Successfully", newItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAllItems = async (req: Request, res: Response) => {
  try {
    const {
      search = "",
      category = "",
      minPrice = 0,
      maxPrice = Number.MAX_SAFE_INTEGER,
      page = 1,
      limit = 10,
      format,
      width,
      height,
      quality,
    } = req.query;

    // Convert query parameters to appropriate types
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const minPriceValue = parseFloat(minPrice as string);
    const maxPriceValue = parseFloat(maxPrice as string);

    // Build query object with case-insensitive partial match
    const query: any = {
      price: { $gte: minPriceValue, $lte: maxPriceValue },
      title: { $regex: search, $options: "i" }, // 'i' for case-insensitive search
    };
    if (category) {
      query.category = category;
    }

    // Get items with pagination
    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .populate("seller", ["firstName", "lastName", "email"]);

    // Transform images for each item
    const transformedItems = await Promise.all(
      items.map(async (item) => {
        const images: ImageDetail[] = item.images.map((image) => {
          let transformedUrl = cloudfrontDomain + image.key;
          if (format || width || height || quality) {
            const params = [];
            if (format) params.push(`format=${format}`);
            if (width) params.push(`width=${width}`);
            if (height) params.push(`height=${height}`);
            if (quality) params.push(`quality=${quality}`);
            transformedUrl += `?${params.join("&")}`;
          }

          return {
            url: getSignedUrl({
              url: transformedUrl,
              dateLessThan: new Date(
                Date.now() + 60 * 60 * 1000 * 24
              ).toISOString(),
              privateKey: process.env.CLOUDFRONT_PRIVATE_KEY!,
              keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID!,
            }),
            key: image.key,
          };
        });

        return { ...item.toObject(), images, contact_no: item.contact_no };
      })
    );

    // Get total count for pagination
    const totalItems = await Item.countDocuments(query);
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      items: transformedItems,
      pagination: {
        page: pageNumber,
        pageSize: pageSize,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getItems = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { format = "webp", width, height, quality } = req.query;

    const items = await Item.find({ seller: userId }).populate("seller", [
      "firstName",
      "lastName",
      "email",
    ]);

    const transformedItems = await Promise.all(
      items.map(async (item) => {
        const images: ImageDetail[] = item.images.map((image) => {
          let transformedUrl = cloudfrontDomain + image.key;
          if (format || width || height || quality) {
            const params = [];
            if (format) params.push(`format=${format}`);
            if (width) params.push(`width=${width}`);
            if (height) params.push(`height=${height}`);
            if (quality) params.push(`quality=${quality}`);
            transformedUrl += `?${params.join("&")}`;
          }

          return {
            url: getSignedUrl({
              url: transformedUrl,
              dateLessThan: new Date(
                Date.now() + 60 * 60 * 1000 * 24
              ).toISOString(),
              privateKey: process.env.CLOUDFRONT_PRIVATE_KEY!,
              keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID!,
            }),
            key: image.key,
          };
        });

        return { ...item.toObject(), images };
      })
    );

    res.json(transformedItems);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getItemById = async (req: Request, res: Response) => {
  try {
    const { format = "webp", width, height, quality } = req.query;
    // console.log("req.query:", req.query);
    // console.log("req.params:", req.params);
    // console.log("format:", format);
    // console.log("width:", width);
    // console.log("height:", height);

    const item = await Item.findById(req.params.id).populate("seller", [
      "firstName",
      "lastName",
      "email",
    ]);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (!item.images || item.images.length === 0) {
      return res.status(404).json({ message: "Item has no images" });
    }

    const images: ImageDetail[] = item.images.map((image) => {
      let transformedUrl = cloudfrontDomain + image.key;
      if (format || width || height || quality) {
        const params = [];
        if (format) params.push(`format=${format}`);
        if (width) params.push(`width=${width}`);
        if (height) params.push(`height=${height}`);
        if (quality) params.push(`quality=${quality}`);
        transformedUrl += `?${params.join("&")}`;
      }

      return {
        url: getSignedUrl({
          url: transformedUrl,
          dateLessThan: new Date(
            Date.now() + 60 * 60 * 1000 * 24
          ).toISOString(),
          privateKey: process.env.CLOUDFRONT_PRIVATE_KEY!,
          keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID!,
        }),
        key: image.key,
      };
    });

    res.json({ ...item.toObject(), images });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item || item.seller.toString() !== req.user?.id) {
      return res
        .status(404)
        .json({ message: "Item not found or not authorized" });
    }
    if (req.body.title && req.body.title !== item.title) {
      const existingItem = await Item.findOne({
        title: req.body.title,
        seller: req.user?.id,
      });
      if (existingItem) {
        return res
          .status(400)
          .json({ message: "You already have an item with this title" });
      }
    }

    Object.assign(item, req.body);
    await item.save();
    res.json(item);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item || item.seller.toString() !== req.user?.id) {
      return res
        .status(404)
        .json({ message: "Item not found or not authorized" });
    }

    // Delete images from S3
    const deleteParams = {
      Bucket: bucketName,
      Delete: {
        Objects: item.images.map((image) => ({ Key: image.key })),
      },
    };
    const deleteCommand = new DeleteObjectsCommand(deleteParams);
    await s3.send(deleteCommand);

    // List and delete transformed images
    const transformedImageKeys = item.images.map((image) => image.key);
    for (const imageKey of transformedImageKeys) {
      const listTransformedParams = {
        Bucket: transformBucketName!,
        Prefix: imageKey + "/",
      };
      const listTransformedCommand = new ListObjectsV2Command(
        listTransformedParams
      );
      const listedObjects = await transformS3.send(listTransformedCommand);

      if (listedObjects.Contents && listedObjects.Contents.length > 0) {
        const deleteTransformedParams = {
          Bucket: transformBucketName!,
          Delete: {
            Objects: listedObjects.Contents.map((content) => ({
              Key: content.Key,
            })),
          },
        };
        const deleteTransformedCommand = new DeleteObjectsCommand(
          deleteTransformedParams
        );
        await transformS3.send(deleteTransformedCommand);
      }
    }

    // Invalidate the CloudFront cache for the deleted images
    const invalidationPaths = item.images.map((image) => `/${image.key}`);
    const invalidationParams = {
      DistributionId: cloudFrontDistID,
      InvalidationBatch: {
        CallerReference: new Date().toISOString(),
        Paths: {
          Quantity: invalidationPaths.length,
          Items: invalidationPaths,
        },
      },
    };
    const invalidationCommand = new CreateInvalidationCommand(
      invalidationParams
    );
    await cloudFront.send(invalidationCommand);

    // Delete the item from the database
    await Item.deleteOne({ _id: item._id });

    // Remove item from user's items list
    await User.findByIdAndUpdate(req.user?.id, { $pull: { items: item._id } });

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};
export const updateImages = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const itemId = req.params.id;
    const item = await Item.findById(itemId);

    if (!item || item.seller.toString() !== userId) {
      return res
        .status(404)
        .json({ message: "Item not found or not authorized" });
    }

    if (item.images.length >= 4) {
      return res
        .status(400)
        .json({ message: "You cannot upload more than 4 images" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload images" });
    }

    // Calculate total size of new images
    const totalSize = (req.files as Express.Multer.File[]).reduce(
      (acc: number, file: Express.Multer.File) => acc + file.size,
      0
    );
    if (totalSize > MAX_FILE_SIZE) {
      return res
        .status(400)
        .json({ message: "Total file size exceeds the 25 MB limit." });
    }

    // Resize and upload new images
    const newImages = [];
    for (const file of req.files as Express.Multer.File[]) {
      const filePath = path.join("uploads", file.filename);

      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        return res.status(400).json({ message: `File not found: ${filePath}` });
      }

      // Resize the image
      //const buffer = await sharp(filePath).toFormat("webp").toBuffer();
      const imageName = randomImageName();
      const params = {
        Bucket: bucketName,
        Key: imageName,
        Body: createReadStream(filePath),
        ContentType: file.mimetype,
      };
      const command = new PutObjectCommand(params);
      await s3.send(command);
      newImages.push({
        url: `${process.env.CLOUDFRONT_DOMAIN}${imageName}`,
        key: imageName,
      });

      // Delete the file from disk after uploading to S3
      await unlinkAsync(filePath);
    }

    // Update images in item
    const updatedImages = [...item.images, ...newImages];
    item.images = updatedImages.slice(0, 4); // Ensure only 4 images are kept
    await item.save();

    res.json({ message: "Images updated successfully", item });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const itemId = req.params.itemId;
    const imageKey = req.params.imageId;

    // console.log("userId:", userId);
    // console.log("itemId:", itemId);
    // console.log("imageKey:", imageKey);
    // console.log(req.params);

    // Find the item
    const item = await Item.findById(itemId);

    if (!item || item.seller._id.toString() !== userId) {
      return res
        .status(404)
        .json({ message: "Item not found or not authorized" });
    }

    // Find the image to delete
    const imageToDelete = item.images.find((image) => image.key === imageKey);

    if (!imageToDelete) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete image from S3
    const deleteParams = {
      Bucket: bucketName,
      Delete: {
        Objects: [{ Key: imageToDelete.key }],
      },
    };
    const deleteCommand = new DeleteObjectsCommand(deleteParams);
    await s3.send(deleteCommand);

    // List and delete transformed images
    const listTransformedParams = {
      Bucket: transformBucketName!,
      Prefix: imageToDelete.key + "/",
    };
    const listTransformedCommand = new ListObjectsV2Command(
      listTransformedParams
    );
    const listedObjects = await transformS3.send(listTransformedCommand);

    if (listedObjects.Contents && listedObjects.Contents.length > 0) {
      const deleteTransformedParams = {
        Bucket: transformBucketName!,
        Delete: {
          Objects: listedObjects.Contents.map((content) => ({
            Key: content.Key,
          })),
        },
      };
      const deleteTransformedCommand = new DeleteObjectsCommand(
        deleteTransformedParams
      );
      await transformS3.send(deleteTransformedCommand);
    }

    // Invalidate the CloudFront cache for the deleted image
    const invalidationParams = {
      DistributionId: cloudFrontDistID,
      InvalidationBatch: {
        CallerReference: new Date().toISOString(),
        Paths: {
          Quantity: 1,
          Items: [`/${imageToDelete.key}`],
        },
      },
    };
    const invalidationCommand = new CreateInvalidationCommand(
      invalidationParams
    );
    await cloudFront.send(invalidationCommand);

    // Remove image from item
    item.images = item.images.filter((image) => image.key !== imageKey);
    await item.save();

    res.json({ message: "Image deleted successfully", item });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};
