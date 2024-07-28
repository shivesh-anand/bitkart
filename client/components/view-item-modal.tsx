/* eslint-disable prettier/prettier */
import { Button } from '@nextui-org/button';
import { Image } from '@nextui-org/image';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/modal';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface ViewItemModalProps {
  itemid: string;
  onClose: () => void;
}

export default function ViewItemModal({ itemid, onClose }: ViewItemModalProps) {
  return (
    <Modal isOpen onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{itemid}</ModalHeader>
        <ModalBody>
          <div className="flex flex-wrap items-center justify-center">
            <Carousel
              className="w-full relative"
              opts={{
                loop: true,
              }}
            >
              <CarouselContent>
                {Array.from({ length: 4 }).map((_, index) => (
                  <CarouselItem key={index}>
                    <Image
                      alt="Product image"
                      className="object-cover w-full h-full"
                      src={itemdetails.imageURLS[index]}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2" />
              <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2" />
            </Carousel>
          </div>
          <div>
            <h1>Ad Title: {itemdetails.title}</h1>
            <p>Description: {itemdetails.description}</p>
            <h1>Price: {itemdetails.price}</h1>
            <p>Room Number: {itemdetails['room number']}</p>
            <p>Hostel Number: {itemdetails['hostel number']}</p>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

const itemdetails = {
  imageURLS: [
    'https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg',
    'https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg',
    'https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg',
    'https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg',
  ],
  title: 'Item Title',
  price: '₹ 1000',
  description: 'Item Description',
  'room number': 428,
  'hostel number': 5,
};
