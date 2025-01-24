"use client";

import Link from "next/link";
import React, { type ComponentProps } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { usePathname } from "next/navigation";
import ShoppingCart from "./ShoppingCart";
import { useSession } from "next-auth/react";

export function Nav({ className }: { className?: string }) {
  const session = useSession();

  return (
    <Disclosure as="nav" className={className}>
      {({ open }) => (
        <>
          <div className="grid grid-cols-3 items-center w-full h-16 sm:h-20 px-2 pr-4 sm:px-4 md:px-8">
            <div className="flex items-center justify-start">
              <div className="sm:hidden">
                {/* Mobile menu button*/}
                <DisclosureButton className="inline-flex items-center justify-center p-2 rounded-md text-text hover:text-accentColor focus:outline-none">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </DisclosureButton>
              </div>
              <div className="hidden sm:flex sm:items-center">
                <NavLogo imgSrc="/logo.svg" alt="TizmaBeats" />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="sm:hidden">
                <NavLogo imgSrc="/logo.svg" alt="TizmaBeats" />
              </div>
              <div className="hidden sm:flex sm:items-center">
                <NavLink href="/beats">Beats</NavLink>
                <NavLink href="/beat-bundles">Beat-Bundles</NavLink>
                <NavLink href="/contact">Contact</NavLink>
                {session.data?.user && (
                  <NavLink href="/dashboard">Dashboard</NavLink>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end">
              <ShoppingCart />
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink href="/beats">Beats</NavLink>
              <NavLink href="/beat-bundles">Beat-Bundles</NavLink>
              <NavLink href="/contact">Contact</NavLink>
              {session.data?.user && (
                <NavLink href="/dashboard">Dashboard</NavLink>
              )}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}

export function NavLink(props: ComponentProps<typeof Link>) {
  const path = usePathname();
  const isActive = path.startsWith(props.href as string);

  return (
    <Link
      {...props}
      className={`py-1 px-2 mx-1 md:mx-3 ${
        isActive ? "bg-text text-mantle" : "text-text bg-crust"
      } text-md lg:text-lg hover:text-mantle hover:bg-text rounded-lg hover:rounded-lg hover:duration-500 uppercase font-bold whitespace-nowrap`}
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
      className="text-xl sm:text-lg p-2 md:text-xl lg:text-2xl text-text hover:text-accentColor hover:duration-300 uppercase"
    >
      TizmaBeats
    </Link>
  );
}
