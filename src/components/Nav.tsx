"use client";

import Link from "next/link";
import React, { ComponentProps } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingBag,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";

export function Nav({ children }: { children: React.ReactNode }) {
  return (
    <nav className="sticky z-50 top-5 rounded-lg w-3/5 bg-crust uppercase h-32 flex flex-col sm:h-16 sm:flex sm:flex-row sm:justify-between sm:items-center">
      {" "}
      {/*  */}
      <div className="">{Array.isArray(children) ? children[0] : children}</div>
      <div className="">
        {Array.isArray(children) ? children.slice(1, -1) : children}
      </div>
      <div>
        {Array.isArray(children) ? children[children.length - 1] : children}
      </div>
    </nav>
  );
}

export function NavLink(props: ComponentProps<typeof Link>) {
  const path = usePathname();
  const isActive = path === props.href;
  return (
    <Link
      {...props}
      className={`mr-5 p-2 ${
        isActive ? "bg-text text-mantle" : "text-text bg-crust"
      } hover:text-mantle hover:bg-text rounded-lg hover:rounded-lg hover:duration-300`}
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
    <Link href="/" className="p-2 pl-5 text-xl text-text hover:text-blue hover:duration-300">
      Tizmabeats
    </Link>
  );
}

export function NavShoppingCart({ count }: { count?: number }) {
  return (
    <div className="pr-3">
      <Link
        href="/cart"
        className="sm:p-2 text-text hover:text-blue hover:duration-300"
      >
        <FontAwesomeIcon icon={faShoppingCart} size="2x"/>
        <div className="absolute h-6 w-6 bg-red rounded-xl top-8 right-4 flex items-center justify-center">
          <div className="text-text">{count}</div>
        </div>
      </Link>
    </div>
  );
}
