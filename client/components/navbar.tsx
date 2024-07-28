/* eslint-disable prettier/prettier */
'use client';

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from '@nextui-org/navbar';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from '@nextui-org/dropdown';
import { Button } from '@nextui-org/button';
import { Kbd } from '@nextui-org/kbd';
import { Link } from '@nextui-org/link';
import { Input } from '@nextui-org/input';
import { link as linkStyles } from '@nextui-org/theme';
import NextLink from 'next/link';
import clsx from 'clsx';
import { Avatar } from '@nextui-org/avatar';
import { usePathname, useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

import { siteConfig } from '@/config/site';
import { ThemeSwitch } from '@/components/theme-switch';
import {
  SearchIcon,
  AccountEditIcon,
  SignOut,
  HelpIcon,
  CartIcon,
  AddIcon,
  SignIn,
} from '@/components/icons';

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isLoggedIn = true; // Change this according to your authentication logic
  const id = 123;
  const imageURL = 'https://i.pravatar.cc/150?u=a042581f4e29026024d';
  function handleLogout() {
    toast.success('Logged out successfully');
  }
  const handleSellButtonClick = () => {
    try {
      if (!isLoggedIn) {
        toast.error('You need to be logged in to access this page.');
        router.push('/login');
      } else {
        router.push(`/user/${id}/sell`);
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred. Please try again.');
    }
  };
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: 'bg-default-100',
        input: 'text-sm',
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={['command']}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
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
          {!isAuthPage && (
            <div>
              {isLoggedIn ? (
                <Dropdown>
                  <DropdownTrigger>
                    <Avatar
                      isBordered
                      showFallback
                      size="sm"
                      src={imageURL}
                      className="cursor-pointer"
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
                        href={`/user/${id}/edit-profile`}
                        startContent={<AccountEditIcon />}
                      >
                        Edit Profile
                      </DropdownItem>
                      <DropdownItem
                        key="items"
                        description="View and manage items for sale"
                        href={`/user/${id}/my-items`}
                        startContent={<CartIcon />}
                      >
                        My Items
                      </DropdownItem>
                      <DropdownItem
                        key="help"
                        description="Need Assistance? Get help here"
                        href={`/user/${id}/help`}
                        startContent={<HelpIcon />}
                      >
                        Help
                      </DropdownItem>
                    </DropdownSection>
                    <DropdownSection>
                      <DropdownItem
                        key="logout"
                        className="text-danger"
                        color="danger"
                        startContent={<SignOut className={'text-danger'} />}
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
                  onClick={() => router.push('/login')}
                >
                  Login
                </Button>
              )}
            </div>
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

          <NavbarMenuToggle className="sm:hidden" />
        </NavbarContent>

        <NavbarContent className="mt-2 justify-center hidden lg:flex">
          <ul className="flex gap-4 justify-center w-full">
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: 'foreground' }),
                    'data-[active=true]:text-primary data-[active=true]:font-medium'
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
                color={
                  index === 2
                    ? 'primary'
                    : index === siteConfig.navMenuItems.length - 1
                      ? 'danger'
                      : 'foreground'
                }
                href="#"
                size="lg"
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
