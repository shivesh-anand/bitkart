/* eslint-disable prettier/prettier */
"use client";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Image } from "@nextui-org/image";
import { Pagination } from "@nextui-org/pagination";
import { Spinner } from "@nextui-org/spinner";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import BlurFade from "./magicui/blur-fade";

import { useGetAllItemsQuery } from "@/redux/api/itemSlice";
import { RootState } from "@/redux/store";

interface ProductProps {
  category?: string;
}

export interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: {
    url: string;
    key: string;
  }[];
  category: string;
  year_of_purchase: number;
  room_no?: string;
  hostel_no: string;
  seller: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductList = ({ category }: ProductProps) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 10; // Items per page
  const [totalPages, setTotalPages] = useState(1);

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const { data, error, isLoading } = useGetAllItemsQuery({
    category,
    format: "webp",
    quality: 50,
    page,
    limit,
  });

  useEffect(() => {
    if (data && data.pagination) {
      setTotalPages(data.pagination.totalPages);
    }
  }, [data]);

  const handlePress = (id: string) => {
    if (!isAuthenticated) {
      router.push("/login");

      return;
    }
    router.push(`/productpage/${id}`);
  };

  const formatDate = (date: moment.MomentInput) =>
    moment(date).format("MMMM D, YYYY");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return toast.error("An error occurred. Please try again later.", {
      id: "error",
    });
  }

  const filteredData = category
    ? data?.items.filter((item: Item) => item.category === category)
    : data?.items;

  return (
    <div>
      <div className="flex flex-wrap gap-4 text-center justify-center">
        {filteredData?.map((item: Item) => (
          <BlurFade key={item._id} inView delay={0.25}>
            <Card
              className="py-4"
              isHoverable={true}
              isPressable={true}
              onPress={() => handlePress(item._id)}
            >
              <CardHeader className="pb-0 pt-2 px-4 flex-row items-start gap-4">
                <Chip variant="faded">
                  Posted On: {formatDate(item.updatedAt)}
                </Chip>
                <h1 className="text-gray-400">Tap to View</h1>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <Image
                  isZoomed
                  alt="Card background"
                  className="object-cover rounded-xl aspect-video"
                  height={225}
                  src={item.images[0].url}
                  width={300}
                />
              </CardBody>
              <CardFooter className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-large">₹{item.price}</h4>
                <p className="font-bold">{item.title}</p>
                <p>Hostel Number: {item.hostel_no}</p>
              </CardFooter>
            </Card>
          </BlurFade>
        ))}
      </div>

      {data.items.length !== 0 && (
        <div className="flex justify-center mt-4">
          <Pagination
            loop
            showControls
            showShadow
            color="success"
            initialPage={1}
            total={totalPages}
            onChange={(page) => setPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default ProductList;
