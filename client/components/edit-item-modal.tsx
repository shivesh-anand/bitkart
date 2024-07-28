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

interface EditItemModalProps {
  itemid: string;
  onClose: () => void;
}

const itemdetails = {
  imageURLS: [
    "https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg",
    "https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg",
  ],
  title: "Item Title",
  price: 1000,
  description: "Item Description",
  "room number": 428,
  "hostel number": 5,
};

export default function EditItemModal({ itemid, onClose }: EditItemModalProps) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [disableUploadButton, setDisableUploadButton] = useState(false);
  const [images, setImages] = useState(itemdetails.imageURLS);
  const [disableEditButton, setDisableEditButton] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    price: "",
    roomNumber: "",
    hostelNumber: "",
  });

  useEffect(() => {
    setDisableUploadButton(images.length >= 4);
  }, [images]);

  const handleDelete = (image: string) => {
    setDeleteLoading(true);
    setDisableEditButton(true);
    setTimeout(() => {
      setImages(images.filter((img) => img !== image));
      toast.success("Image deleted successfully");
      setDisableEditButton(false);
      setDeleteLoading(false);
    }, 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + images.length <= 4) {
      const newImages = files.map((file) => URL.createObjectURL(file));

      setImages([...images, ...newImages]);
    } else {
      toast.error(`You can only upload ${4 - images.length} more images`);
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

  const handleSubmit = () => {
    setDisableEditButton(true);
    setEditLoading(true);
    setTimeout(() => {
      // Collect changed fields

      const updatedFields: any = {};

      Object.keys(formValues).forEach((key) => {
        if (formValues[key]) {
          updatedFields[key] = formValues[key];
        }
      });

      // Include the updated images
      updatedFields.images = images;

      // Submit the updated fields
      setDisableEditButton(false);
      setEditLoading(false);
      console.log("Submitting updated fields:", updatedFields);
      toast.success("Item updated successfully");
      onClose();
    }, 2000);
  };

  return (
    <Modal isOpen scrollBehavior="inside" shadow="lg" onOpenChange={onClose}>
      <Toaster />
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Edit Ad {itemid}
        </ModalHeader>
        <ScrollShadow>
          <ModalBody>
            <div className="flex flex-wrap items-center justify-center">
              <Carousel className="w-full relative" opts={{ loop: true }}>
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <Image
                        alt="Product image"
                        className="object-cover w-full h-full mb-4"
                        src={image}
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
              onSubmit={handleSubmit}
            >
              <Input
                label="Edit Ad Title"
                name="title"
                placeholder={itemdetails.title}
                type="text"
                variant="bordered"
                onChange={handleInputChange}
              />
              <Textarea
                label="Edit Ad Description"
                name="description"
                placeholder={itemdetails.description}
                variant="bordered"
                onChange={handleInputChange}
              />
              <Input
                label="Edit Ad Price"
                name="price"
                placeholder={String(itemdetails.price)}
                startContent="₹"
                type="number"
                variant="bordered"
                onChange={handleInputChange}
              />
              <Input
                label="Edit Room Number"
                name="roomNumber"
                placeholder={String(itemdetails["room number"])}
                type="number"
                variant="bordered"
                onChange={handleInputChange}
              />
              <Input
                label="Edit Hostel Number"
                name="hostelNumber"
                placeholder={String(itemdetails["hostel number"])}
                type="number"
                variant="bordered"
                onChange={handleInputChange}
              />
              <Button
                fullWidth
                color="secondary"
                isDisabled={disableUploadButton}
                isLoading={editLoading}
                size="lg"
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
          </ModalBody>
        </ScrollShadow>
        <ModalFooter>
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
