"use client";

import Link from "next/link";
import React, { ComponentProps } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { usePathname } from "next/navigation";
import ShoppingCart from "./ShoppingCart";

export function Nav({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <Disclosure
      as="nav"
      className={className}
    >
      <div className="">
        <div className="flex flex-row h-20 items-center justify-between">
          <div className="absolute inset-y-0 flex items-center sm:hidden ml-2">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-text focus:outline-none hover:text-accentColor duration-300">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="block size-8 group-data-[open]:hidden"
              >
                <path
                  fillRule="evenodd"
                  d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="hidden size-8 group-data-[open]:block mb-32"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
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
      className="p-2 text-2xl text-text hover:text-accentColor hover:duration-300 uppercase"
    >
      TizmaBeats
    </Link>
  );
}
