/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { Image } from "@nextui-org/image";
import { toast, Toaster } from "react-hot-toast";
import { EditIcon, Trash2Icon } from "lucide-react";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { UploadIcon } from "./icons";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  useUpdateItemMutation,
  useUpdateImagesMutation,
  useDeleteImageMutation,
  useGetItemByIdQuery,
} from "@/redux/api/itemSlice";
import { Item } from "@/types/item";

interface EditItemModalProps {
  initialItem: Item;
  itemId: string; // Added this line
  onClose: () => void;
}

export default function EditItemModal({
  initialItem,
  itemId,
  onClose,
}: EditItemModalProps) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [disableUploadButton, setDisableUploadButton] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [disableEditButton, setDisableEditButton] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    price: "",
    roomNumber: "",
    hostelNumber: "",
  });

  const { data: fetchedItem, refetch } = useGetItemByIdQuery(itemId);
  const [updateItem] = useUpdateItemMutation();
  const [updateImages] = useUpdateImagesMutation();
  const [deleteImage] = useDeleteImageMutation();

  useEffect(() => {
    if (fetchedItem) {
      setImages(fetchedItem.images.map((img: { url: string }) => img.url));
      setFormValues({
        title: fetchedItem.title,
        description: fetchedItem.description,
        price: String(fetchedItem.price),
        roomNumber: String(fetchedItem.room_no || ""),
        hostelNumber: String(fetchedItem.hostel_no),
      });
    }
  }, [fetchedItem]);

  useEffect(() => {
    setDisableUploadButton(images.length >= 4);
  }, [images]);

  const handleDelete = async (imageUrl: string) => {
    setDeleteLoading(true);
    setDisableEditButton(true);
    try {
      const imageId = imageUrl.split("/").pop(); // Assuming image URL ends with imageId

      await deleteImage({ itemId, imageId }).unwrap();
      setImages(images.filter((img) => img !== imageUrl));
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
    } finally {
      setDeleteLoading(false);
      setDisableEditButton(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
    let totalSize = 0;

    if (files.length + images.length > 4) {
      toast.error(`You can only upload ${4 - images.length} more images`);

      return;
    }
    for (let file of files) {
      if (!allowedFormats.includes(file.type)) {
        toast.error("Only JPEG, JPG, or PNG formats are allowed.");

        return;
      }
      totalSize += file.size;
    }

    if (totalSize > 25 * 1024 * 1024) {
      // 25 MB

      toast.error("Total file size exceeds 25 MB.");

      return;
    }
    setDisableUploadButton(true);
    setEditLoading(true);
    try {
      const formData = new FormData();

      files.forEach((file) => formData.append("images", file));
      const response = await updateImages({ id: itemId, formData }).unwrap();

      if (response && response.item && response.item.images) {
        const newImageUrls = response.item.images.map(
          (img: { url: string }) => img.url
        );

        setImages(newImageUrls); // Update images state with new URLs
        toast.success("Images uploaded successfully");
      } else {
        toast.error("Failed to upload images");
      }
    } catch (error) {
      //console.error(error);
      toast.error("Failed to upload images");
    } finally {
      setDisableUploadButton(false);
      setEditLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setDisableEditButton(true);
    setEditLoading(true);
    try {
      const updatedFields: Partial<Item> = {
        title: formValues.title,
        description: formValues.description,
        price: Number(formValues.price),
        room_no: formValues.roomNumber || undefined,
        hostel_no: formValues.hostelNumber || undefined,
      };

      await updateItem({
        id: itemId,
        updatedItem: updatedFields,
      }).unwrap();

      toast.success("Item updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update item");
    } finally {
      setDisableEditButton(false);
      setEditLoading(false);
    }
  };

  return (
    <Modal isOpen scrollBehavior="inside" shadow="lg" onOpenChange={onClose}>
      <Toaster />
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Edit Item {formValues.title}
        </ModalHeader>
        <ScrollShadow>
          <ModalBody>
            <div className="flex flex-wrap items-center justify-center">
              <Carousel className="w-full relative" opts={{ loop: true }}>
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <Image
                        isBlurred
                        alt="Product image"
                        className="object-contain"
                        height={300}
                        src={image}
                        width={400}
                      />
                      <Button
                        fullWidth
                        color="danger"
                        isDisabled={deleteLoading}
                        isLoading={deleteLoading}
                        startContent={<Trash2Icon />}
                        variant="shadow"
                        onClick={() => handleDelete(image)}
                      >
                        {deleteLoading ? "Deleting Image..." : "Delete Image"}
                      </Button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2" />
              </Carousel>
            </div>
            <form
              className="flex flex-col py-4 px-4 gap-4 w-full"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <Input
                label="Edit Item Title"
                name="title"
                placeholder={formValues.title}
                type="text"
                value={formValues.title}
                variant="bordered"
                onChange={handleInputChange}
              />
              <Textarea
                label="Edit Item Description"
                name="description"
                placeholder={formValues.description}
                value={formValues.description}
                variant="bordered"
                onChange={handleInputChange}
              />
              <Input
                label="Edit Item Price"
                name="price"
                placeholder={String(formValues.price)}
                startContent="₹"
                type="number"
                value={formValues.price}
                variant="bordered"
                onChange={handleInputChange}
              />
              <Input
                label="Edit Room Number"
                name="roomNumber"
                placeholder={String(formValues.roomNumber)}
                type="number"
                value={formValues.roomNumber}
                variant="bordered"
                onChange={handleInputChange}
              />
              <Input
                label="Edit Hostel Number"
                name="hostelNumber"
                placeholder={String(formValues.hostelNumber)}
                type="number"
                value={formValues.hostelNumber}
                variant="bordered"
                onChange={handleInputChange}
              />
            </form>
          </ModalBody>
        </ScrollShadow>
        <ModalFooter>
          <form>
            <Button
              fullWidth
              color="secondary"
              isDisabled={disableUploadButton}
              isLoading={editLoading}
              startContent={<UploadIcon />}
              variant="shadow"
            >
              {images.length === 4
                ? "Maximum Photos uploaded"
                : `Upload ${4 - images.length} More Photos`}
              <Input
                fullWidth
                isClearable
                multiple
                accept=".jpeg, .jpg, .png"
                className="absolute inset-0.5 opacity-0 cursor-pointer"
                size="lg"
                type="file"
                variant="bordered"
                onChange={handleImageUpload}
              />
            </Button>
          </form>
          <Button
            color="success"
            isDisabled={disableEditButton}
            isLoading={editLoading}
            startContent={<EditIcon />}
            variant="shadow"
            onClick={handleSubmit}
          >
            {editLoading ? "Updating..." : "Edit Ad"}
          </Button>
          <Button
            color="primary"
            isDisabled={disableEditButton}
            onPress={onClose}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
