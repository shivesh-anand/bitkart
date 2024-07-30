import { Request, Response } from "express";
import Item from "../models/itemModel.js";
import User from "../models/userModel.js";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import crypto from "crypto";
import sharp from "sharp";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN;
const cloudFrontDistID = process.env.CLOUDFRONT_DIST_ID;

const transformBucketName = process.env.AWS_TRANSFORM_BUCKET_NAME;
const transformRegion = process.env.AWS_TRANSFORM_BUCKET_REGION;
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

export const createItem = async (req: Request, res: Response) => {
  try {
    //console.log("req.body", req.body);
    //console.log("req.file", req.file);
    const userId = req.user?.id;
    const {
      title,
      description,
      price,
      room_no,
      hostel_no,
      year_of_purchase,
      category,
    } = req.body;

    const existingItem = await Item.findOne({ title, seller: userId });
    if (existingItem) {
      return res
        .status(400)
        .json({ message: "You already have an item with this title" });
    }

    //resize image
    const buffer = await sharp(req.file?.buffer).toFormat("webp").toBuffer();

    const imageName = randomImageName();
    const params = {
      Bucket: bucketName!,
      Key: imageName,
      Body: buffer,
      ContentType: req.file?.mimetype,
    };
    const command = new PutObjectCommand(params);

    await s3.send(command);

    const newItem = new Item({
      title,
      description,
      price,
      room_no,
      hostel_no,
      year_of_purchase,
      category,
      seller: userId,
      images: imageName,
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
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getItems = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const items = await Item.find({ seller: userId }).populate("seller", [
      "firstName",
      "lastName",
      "email",
    ]);

    //console.log(items);

    for (const item of items) {
      //console.log("item:", item);

      if (item.images && item.images.length > 0) {
        // item.images[0] = cloudfrontDomain + item.images[0];
        item.images[0] = getSignedUrl({
          url: cloudfrontDomain + item.images[0] + "?width=400&height=300",
          dateLessThan: new Date(
            Date.now() + 60 * 60 * 1000 * 24
          ).toISOString(),
          privateKey: process.env.CLOUDFRONT_PRIVATE_KEY!,
          keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID!,
        });
      }
    }

    res.json(items);
  } catch (error) {
    //console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getItemById = async (req: Request, res: Response) => {
  try {
    const item = await Item.findById(req.params.id).populate("seller", [
      "firstName",
      "lastName",
      "email",
    ]);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
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
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);
    console.log("item:", item);
    if (!item || item.seller.toString() !== req.user?.id) {
      return res
        .status(404)
        .json({ message: "Item not found or not authorized" });
    }

    const params = {
      Bucket: bucketName!,
      Key: item.images[0],
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    // List and delete transformed images
    const imageKey = item.images[0];
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
    //Invalidate the cloudfront cache for the deleted image
    const invalidationParams = {
      DistributionId: cloudFrontDistID,
      InvalidationBatch: {
        CallerReference: item.images[0],
        Paths: {
          Quantity: 1,
          Items: ["/" + item.images[0]],
        },
      },
    };

    const invalidationCommand = new CreateInvalidationCommand(
      invalidationParams
    );
    await cloudFront.send(invalidationCommand);

    await Item.deleteOne({ _id: item._id });

    await User.findByIdAndUpdate(req.user?.id, { $pull: { items: item._id } });

    res.json({ message: "Item removed" });
  } catch (error) {
    //console.error("Error deleting item:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
