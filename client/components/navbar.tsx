/* eslint-disable prettier/prettier */
"use client";

import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Input } from "@nextui-org/input";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import {
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
} from "@nextui-org/navbar";
import { link as linkStyles } from "@nextui-org/theme";
import clsx from "clsx";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import {
  AccountEditIcon,
  AddIcon,
  CartIcon,
  SearchIcon,
  SignIn,
  SignOut,
} from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";
import { logout } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated);
  }, [isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/");
  };

  const handleSellButtonClick = () => {
    if (!isLoggedIn) {
      toast.error("You need to be logged in to access this page.");
      router.push("/login");
    } else {
      router.push(`/user/${user?._id}/sell`);
    }
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    const query = e.target.elements.search.value;

    if (query.trim()) {
      router.push(`/results?search=${query}`);
    }
  };

  const searchInput = (
    <form className="flex w-full" onSubmit={handleSearch}>
      <Input
        aria-label="Search"
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm",
        }}
        endContent={
          <Kbd className="hidden lg:inline-block w-36" keys={["enter"]}>
            Enter to Search
          </Kbd>
        }
        labelPlacement="outside"
        name="search"
        placeholder="Search..."
        startContent={
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
        type="search"
      />
      <button className="hidden" type="submit" />
    </form>
  );

  return (
    <NextUINavbar className="fixed pb-8" maxWidth="full">
      <Toaster />
      <div className="w-full flex flex-col">
        <NavbarContent className="basis-1/5 sm:basis-full justify-between items-center mt-10">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink
              className="flex justify-start items-center gap-1"
              href="/"
            >
              <p className="font-bold text-xl">BitKart</p>
            </NextLink>
          </NavbarBrand>

          <div className="hidden lg:flex flex-grow mx-4">{searchInput}</div>

          {/* Only show Dropdown if not on an auth page */}
          {!pathname.startsWith("/login") &&
          !pathname.startsWith("/signup") &&
          isLoggedIn ? (
            <Dropdown>
              <DropdownTrigger>
                <Avatar
                  isBordered
                  showFallback
                  className="cursor-pointer"
                  size="sm"
                />
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Dropdown menu with description"
                variant="faded"
              >
                <DropdownSection showDivider title="Actions">
                  <DropdownItem
                    key="edit-profile"
                    description="View and Edit your profile"
                    href={`/user/${user?._id}/edit-profile`}
                    startContent={<AccountEditIcon />}
                  >
                    Edit Profile
                  </DropdownItem>
                  <DropdownItem
                    key="items"
                    description="View and manage items for sale"
                    href={`/user/${user?._id}/my-items`}
                    startContent={<CartIcon />}
                  >
                    My Items
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection>
                  <DropdownItem
                    key="logout"
                    className="text-danger"
                    color="danger"
                    startContent={<SignOut className={"text-danger"} />}
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    Log Out
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              className="text-md font-bold transition duration-200 hover:bg-sky-500 hover:text-black"
              startContent={<SignIn />}
              variant="shadow"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          )}

          <Button
            as={Link}
            className="text-md font-bold md:flex transition duration-200 hover:bg-green-500 hover:text-black"
            startContent={<AddIcon />}
            variant="shadow"
            onClick={handleSellButtonClick}
          >
            Sell
          </Button>
          <div className="flex gap-2">
            <ThemeSwitch />
          </div>

          <NavbarMenuToggle className="sm:hidden" onClick={toggleMenu} />
        </NavbarContent>

        <NavbarContent className="mt-2 justify-center hidden lg:flex">
          <ul className="flex gap-4 justify-center w-full">
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </ul>
        </NavbarContent>
      </div>

      <NavbarMenu className="mt-8">
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={"foreground"}
                href={item.href}
                size="lg"
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
