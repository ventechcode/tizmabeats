"use client";

import Link from "next/link";
import React, { ComponentProps } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { faXmark, faBars } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import ShoppingCart from "./ShoppingCart";

export function Nav({ children }: { children: React.ReactNode }) {
  return (
    <Disclosure as="nav" className="bg-crust top-0 absolute z-50 w-screen px-2 sm:px-8">
      <div className="">
        <div className="flex h-20 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 focus:outline-none">
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
                className="hidden size-6 group-data-[open]:block mb-32"
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
            <ShoppingCart />
          </div>
        </div>
      </div>
      <DisclosurePanel className="sm:hidden">
        <div className="flex flex-col space-y-1 px-2 pb-4 pt-3 w-max">
          {children}
        </div>
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
      } sm:text-lg hover:text-mantle hover:bg-text rounded-lg hover:rounded-lg hover:duration-500 uppercase font-bold`}
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
      className="p-2 text-2xl text-text hover:text-blue hover:duration-300 uppercase"
    >
      TizmaBeats
    </Link>
  );
}
