"use client";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Image } from "@nextui-org/image";
import { Spinner } from "@nextui-org/spinner";
import { Key, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useGetItemByIdQuery } from "@/redux/api/itemSlice";
import { Link } from "@nextui-org/link";

export default function ProductPage({
  params,
}: {
  params: { productid: string };
}) {
  const productId = params.productid;
  const { data, error, isLoading } = useGetItemByIdQuery(productId);
  //console.log("data", data);

  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function updateSize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const aspectRatio = 3 / 2;
      let newWidth = width;
      let newHeight = width / aspectRatio;

      if (newHeight > height) {
        newHeight = height / aspectRatio;
        newWidth = height * aspectRatio;
      }

      setImageSize({ width: newWidth, height: newHeight });
    }

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    toast.error("An error occurred. Please try again.");

    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card
        isBlurred
        className="justify-center items-center w-full mx-auto"
        shadow="lg"
      >
        <Carousel className="w-full relative" opts={{ loop: true }}>
          <CarouselContent>
            {data.images.length > 0 ? (
              data.images.map(
                (
                  image: { url: string | undefined },
                  index: Key | null | undefined
                ) => (
                  <CarouselItem key={index}>
                    <Image
                      isBlurred
                      alt="Product image"
                      className="object-contain w-full h-full"
                      height={imageSize.height}
                      src={image.url}
                      width={imageSize.width}
                    />
                  </CarouselItem>
                )
              )
            ) : (
              <p>No images available.</p>
            )}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2" />
          <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2" />
        </Carousel>
      </Card>

      <Card isBlurred className="w-full mx-auto" shadow="lg">
        <CardHeader className="flex flex-col gap-3 items-start text-left">
          <li className="font-bold text-lg">Title: {data.title}</li>
          <li className="font-bold text-lg">Price: {data.price}</li>
          <li className="font-bold text-lg">Category: {data.category}</li>
        </CardHeader>
        <Divider />
        <CardBody>
          <li className="font-bold text-lg">
            Description: <p className="ml-6 font-normal">{data.description}</p>
          </li>
          <li className="font-bold text-lg">
            Year of Purchase: {data.year_of_purchase}
          </li>
        </CardBody>
        <Divider />
        <CardBody>
          <li className="font-bold text-lg">Seller Details</li>
          <div className="ml-6">
            <li className="font-normal text-lg">
              Name: {data.seller.firstName} {data.seller.lastName}
            </li>
            <li className="font-normal text-lg">
              Room Number: {data.room_no ? data.room_no : "Not Available"}
            </li>
            <li className="font-normal text-lg">
              Hostel Number: {data.hostel_no}
            </li>
            <li className="font-normal text-lg">
              Contact Number:{" "}
              {data.contact_no && data.conatact_no !== undefined ? (
                <Link href={`tel:${data.contact_no}`}>{data.contact_no}</Link>
              ) : (
                "Not Available"
              )}
            </li>
            <li className="font-normal text-lg">
              Email:{" "}
              <Link href={`mailto:${data.seller.email}`}>
                {data.seller.email}
              </Link>
            </li>
          </div>
        </CardBody>
        <Divider />
        {/* <CardFooter>
          <Button
            fullWidth
            className="mx-10 font-bold text-lg"
            color="success"
            size="lg"
            startContent={<ChatIcon />}
            variant="shadow"
          >
            Chat with Seller
          </Button>
        </CardFooter> */}
      </Card>
    </div>
  );
}
