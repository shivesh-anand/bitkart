/* eslint-disable prettier/prettier */
"use client";
import { Button } from "@nextui-org/button";

import { CartIcon } from "@/components/icons";
import GradualSpacing from "@/components/magicui/gradual-spacing";
import ProductList from "@/components/product-list";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasRefreshed, setHasRefreshed] = useState(false);

  useEffect(() => {
    const refresh = searchParams.get("refresh");

    // Check if the refresh parameter is present
    if (refresh === "true" && !hasRefreshed) {
      // Remove the refresh query parameter and set a flag
      localStorage.removeItem("loggedIn");
      router.replace("/"); // Using replace to prevent adding another entry to the history stack
      setHasRefreshed(true);
    }
  }, [searchParams, router, hasRefreshed]);
  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <div className="flex flex-row items-center justify-center gap-4 mb-4">
        <Button isIconOnly size="lg" variant="ghost">
          <CartIcon size={30} />
        </Button>{" "}
        <GradualSpacing
          className="font-display text-center text-2xl md:text-4xl lg:text-5xl font-bold tracking-[-0.1em]  text-black dark:text-white md:leading-[5rem]"
          text="Buy & Sell Used Items"
        />
      </div>

      <ProductList category="" />
    </section>
  );
}
