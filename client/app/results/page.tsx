"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Image } from "@nextui-org/image";
import { Pagination } from "@nextui-org/pagination";
import { Spinner } from "@nextui-org/spinner";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import BlurFade from "@/components/magicui/blur-fade";
import { useGetAllItemsQuery } from "@/redux/api/itemSlice";
import { Item } from "@/types/item";

const metadata = {
  title: "Search Results - Bitkart",
  description:
    "Browse through search results for items listed on Bitkart. Find the best deals on second-hand items posted by BIT Mesra students.",
  keywords: [
    "Bitkart search results",
    "second-hand items",
    "student marketplace",
    "BIT Mesra shopping",
    "BIT Mesra second-hand",
    "Birla Institute of Technology",
    "BIT Mesra",
    "student deals",
    "online marketplace",
    "used items",
  ],
  author: "Shivesh Anand",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1.0",
  charset: "UTF-8",
};

const ResultsPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 10;
  const router = useRouter();

  const { data, error, isLoading } = useGetAllItemsQuery({
    search: query,
    page,
    limit,
  });

  //console.log("search data", data);

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (data) {
      setTotalPages(data.pagination.totalPages);
    }
  }, [data]);

  useEffect(() => {
    if (data && data.pagination) {
      setTotalPages(data.pagination.totalPages);
    }
  }, [data]);

  const handlePress = (id: string) => {
    router.push(`/productpage/${id}`);
  };

  const formatDate = (date: moment.MomentInput) =>
    moment(date).format("MMMM D, YYYY");

  const handlePageChange = (page: number) => {
    window.location.href = `/results?search=${query}&page=${page}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <p>An error occurred. Please try again later.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for &quot;{query}&quot;
      </h1>
      <div className="flex flex-wrap gap-4 text-center justify-center">
        {data.items.length === 0 ? (
          <p>No items found for your search query.</p>
        ) : (
          data.items.map((item: Item) => (
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
          ))
        )}
      </div>
      {data.items.length > 0 && (
        <div className="flex justify-center mt-4">
          <Pagination
            initialPage={page}
            total={totalPages}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
