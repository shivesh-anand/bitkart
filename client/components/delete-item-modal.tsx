/* eslint-disable prettier/prettier */
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { useDeleteItemMutation } from "@/redux/api/itemSlice";

interface DeleteConfirmationModalProps {
  item: {
    _id: string;
    title: string;
  };

  onClose: () => void;
}

export default function DeleteConfirmationModal({
  item,
  onClose,
}: DeleteConfirmationModalProps) {
  const [deleteItem, { isLoading }] = useDeleteItemMutation();
  const [disableButton, setDisableButton] = useState(false);
  //console.log("delete item", item);
  const handleDelete = async () => {
    setDisableButton(true);
    try {
      await deleteItem(item._id).unwrap();
      toast.success("Item deleted successfully");
      onClose();
    } catch (error) {
      //console.error("Failed to delete item:", error);
      toast.error("Failed to delete item");
      setDisableButton(false);
    }
  };

  return (
    <Modal isOpen onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Are you sure you want to delete {item.title}?
        </ModalHeader>

        <ModalFooter>
          <Button
            color="danger"
            isDisabled={disableButton}
            isLoading={isLoading}
            onPress={handleDelete}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
          <Button color="primary" isDisabled={disableButton} onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
