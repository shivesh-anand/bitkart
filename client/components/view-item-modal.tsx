/* eslint-disable prettier/prettier */
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import moment from "moment-timezone";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Item } from "@/types/item";

interface ViewItemModalProps {
  item: Item;
  onClose: () => void;
}

export default function ViewItemModal({ item, onClose }: ViewItemModalProps) {
  //console.log("view item", item);
  const utcDate = moment(item.createdAt);
  const istDate = utcDate
    .tz("Asia/Kolkata")
    .format("DD MMMM, YYYY hh:mm A [IST]");

  const title = "Title: " + item.title;

  return (
    <Modal isOpen scrollBehavior="inside" onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{item.title}</ModalHeader>
        <ModalBody>
          <div className="flex flex-wrap items-center justify-center">
            <Carousel
              className="w-full relative"
              opts={{
                loop: true,
              }}
            >
              <CarouselContent>
                {item.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <Image
                      isBlurred
                      alt="Product image"
                      className="object-contain"
                      height={300}
                      src={image.url}
                      width={400}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2" />
              <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2" />
            </Carousel>
          </div>
          <Accordion fullWidth isCompact>
            <AccordionItem
              key="description"
              aria-label="Title Description"
              className="text-justify"
              subtitle="Press to expand Description"
              title={title}
            >
              {item.description}
            </AccordionItem>
          </Accordion>
          <div className="grid grid-cols-2 px-2">
            <div className="font-semibold text-left">Price:</div>
            <div className="text-left">{item.price}</div>

            <div className="font-semibold text-left">Year of Purchase:</div>
            <div className="text-left">{item.year_of_purchase}</div>

            <div className="font-semibold text-left">Room Number:</div>
            <div className="text-left">{item.room_no || "N/A"}</div>

            <div className="font-semibold text-left">Hostel Number:</div>
            <div className="text-left">{item.hostel_no}</div>

            <div className="font-semibold text-left">Posted On:</div>
            <div className="text-left">{istDate}</div>
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
