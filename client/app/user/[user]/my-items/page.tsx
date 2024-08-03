import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import dynamic from "next/dynamic";

import Ripple from "@/components/magicui/ripple";

const ItemsTable = dynamic(() => import("@/components/items-table"), {
  ssr: false,
});

const items = ["saxsx"];
const MyItemsPage = () => {
  const id = 123;

  return (
    <div>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[475px]">
          <p className="font-black lg:text-5xl sm:text-2xl md:text-5xl mb-4 text-center flex flex-col items-center justify-center gap-4">
            No Ads Found, Create One Now!
            <Button
              as={Link}
              className="max-w-xs z-10"
              color="success"
              href={`/user/${id}/sell`}
              variant="shadow"
            >
              Sell an Item
            </Button>
          </p>
          <Ripple />
        </div>
      ) : (
        <ItemsTable />
      )}
    </div>
  );
};

export default MyItemsPage;
