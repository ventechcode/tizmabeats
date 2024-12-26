"use client";

import Link from "next/link";
import React, { ComponentProps } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  faShoppingCart,
  faXmark,
  faBars
} from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Nav({ children }: { children: React.ReactNode }) {
  return (
    <Disclosure as="nav" className="bg-crust z-50 w-screen px-2 sm:px-8">
      <div className="">
        <div className="relative flex h-20 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <FontAwesomeIcon
                icon={faBars}
                aria-hidden="true"
                className="block size-6 group-data-[open]:hidden"
              />
              <FontAwesomeIcon
                icon={faXmark}
                aria-hidden="true"
                className="hidden size-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>
          <div className="w-full flex flex-row items-center justify-center sm:items-stretch sm:justify-between">
            <div className="flex shrink-0 items-center">
              <NavLogo imgSrc="/logo.svg" alt="TizmaBeats" />
            </div>
            <div className="hidden sm:mr-20 md:mr-32 sm:flex sm:flex-row sm:justify-center sm:items-center">
              {children}
            </div>
            <Sheet>
              <SheetTrigger>
                <div className="absolute right-3 sm:right-1 md:right-0 top-6 hover:text-blue hover:duration-300">
                  <FontAwesomeIcon icon={faShoppingCart} size="2x" />
                  <div className="absolute right-0 bottom-0 transform translate-x-1/2 translate-y-1/2 h-6 w-6 bg-red-400 rounded-full flex items-center justify-center">
                    <div className="text-text">{3}</div>
                  </div>
                </div>
              </SheetTrigger>
              <SheetContent className="bg-mantle border-0">
                <SheetHeader>
                  <SheetTitle>Shopping Cart</SheetTitle>
                  <SheetDescription>View your cart</SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <DisclosurePanel className="sm:hidden">
        <div className="flex flex-col space-y-1 px-2 pb-3 pt-2">{children}</div>
      </DisclosurePanel>
    </Disclosure>
  );
}

export function NavLink(props: ComponentProps<typeof Link>) {
  const path = usePathname();
  const isActive = path === props.href;
  return (
    <Link
      {...props}
      className={`py-1 px-2 mx-1 md:mx-3 ${
        isActive ? "bg-text text-mantle" : "text-text bg-crust"
      } sm:text-lg hover:text-mantle hover:bg-text rounded-lg hover:rounded-lg hover:duration-500`}
    />
  );
}

export function NavLogo({
  imgSrc,
  alt,
}: {
  href?: string;
  imgSrc: string;
  alt: string;
}) {
  return (
    <Link
      href="/"
      className="p-2 text-2xl text-text hover:text-blue hover:duration-300"
    >
      TizmaBeats
    </Link>
  );
}
