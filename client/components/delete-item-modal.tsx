/* eslint-disable prettier/prettier */
import { Button } from '@nextui-org/button';
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/modal';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface DeleteConfirmationModalProps {
  itemid: string;
  onClose: () => void;
}

export default function DeleteConfirmationModal({
  itemid,
  onClose,
}: DeleteConfirmationModalProps) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  function handleDelete(itemid: string) {
    setDisableButton(true);
    setDeleteLoading(true);
    setTimeout(() => {
      toast.success('Item deleted successfully');
      setDeleteLoading(false);
      onClose();
    }, 2000);
  }

  return (
    <Modal isOpen onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Are you sure you want to delete {itemid}?
        </ModalHeader>

        <ModalFooter>
          <Button
            color="danger"
            isDisabled={disableButton}
            isLoading={deleteLoading}
            onPress={() => handleDelete(itemid)}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
          <Button color="primary" onPress={onClose} isDisabled={disableButton}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
