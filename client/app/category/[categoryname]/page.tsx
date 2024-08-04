import { Button } from "@nextui-org/button";

import {
  BikeIcon,
  BooksIcon,
  ClothingIcon,
  ElectronicsIcon,
  HeartFilledIcon,
  HomeIcon,
  HospitalIcon,
  ShoeIcon,
  SportsIcon,
  StationaryIcon,
  WatchIcon,
} from "@/components/icons"; // Import all required icons
import GradualSpacing from "@/components/magicui/gradual-spacing";
import ProductList from "@/components/product-list";
import { IconSvgProps } from "@/types";

type Category =
  | "stationary"
  | "bikes"
  | "electronics"
  | "hostel-essentials"
  | "clothing"
  | "shoes"
  | "accessories"
  | "beauty-and-health"
  | "sports"
  | "books-and-notes"
  | "others";

const categoryIcons: Record<Category, React.FC<IconSvgProps>> = {
  stationary: StationaryIcon,
  bikes: BikeIcon,
  electronics: ElectronicsIcon,
  "hostel-essentials": HomeIcon,
  clothing: ClothingIcon,
  shoes: ShoeIcon,
  accessories: WatchIcon,
  "beauty-and-health": HospitalIcon,
  sports: SportsIcon,
  "books-and-notes": BooksIcon,
  others: HeartFilledIcon,
};

const categoryTitles: Record<Category, string> = {
  stationary: "Stationary",
  bikes: "Bikes",
  electronics: "Electronics",
  "hostel-essentials": "Hostel Essentials",
  clothing: "Clothing",
  shoes: "Shoes",
  accessories: "Accessories",
  "beauty-and-health": "Beauty & Health",
  sports: "Sports",
  "books-and-notes": "Books & Notes",
  others: "Others",
};

export default function CategoryPage({
  params,
}: {
  params: { categoryname: string };
}) {
  const { categoryname } = params;

  const IconComponent = categoryIcons[categoryname as Category];
  const title = categoryTitles[categoryname as Category];

  //console.log("category name", categoryname);

  return (
    <div>
      <div className="flex flex-row items-center justify-center gap-4 mb-4">
        <Button isIconOnly size="lg" variant="ghost">
          <IconComponent size={30} />
        </Button>
        <GradualSpacing
          className="font-display text-center text-2xl md:text-4xl lg:text-5xl font-bold tracking-[-0.1em] text-black dark:text-white md:leading-[5rem]"
          text={title}
        />
      </div>

      <ProductList category={categoryname} />
    </div>
  );
}
