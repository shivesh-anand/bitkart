"use client";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import dynamic from "next/dynamic";
import { Spinner } from "@nextui-org/spinner";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import Ripple from "@/components/magicui/ripple";
import { useGetItemsOfUserQuery } from "@/redux/api/itemSlice";
import { RootState } from "@/redux/store";

const ItemsTable = dynamic(() => import("@/components/items-table"), {
  ssr: false,
});

const MyItemsPage = () => {
  const { data, isLoading, isError } = useGetItemsOfUserQuery(null);

  const _id = useSelector((state: RootState) => state.auth.user);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    toast.error("An error occurred. Please try again.");

    return null;
  }

  return (
    <div>
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[475px]">
          <p className="font-black lg:text-5xl sm:text-2xl md:text-5xl mb-4 text-center flex flex-col items-center justify-center gap-4">
            No Items Found, Create One Now!
            <Button
              as={Link}
              className="max-w-xs z-10"
              color="success"
              href={`/user/${_id}/sell`}
              variant="shadow"
            >
              Sell an Item
            </Button>
          </p>
          <Ripple />
        </div>
      ) : (
        <ItemsTable items={data} />
      )}
    </div>
  );
};

export default MyItemsPage;
