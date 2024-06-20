import Link from "next/link";
import React, { ComponentProps } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

export function Nav({ children }: { children: React.ReactNode[] }) {
  return (
    <nav className="h-16 w-full bg-mantle flex justify-between items-center uppercase">
      <div className="flex justify-start pl-5">{children?.[0] ?? null}</div>
      <div className="flex justify-center gap-4">
        {React.Children.toArray(children)?.slice(1, -1) as React.ReactNode}
      </div>
      <div className="flex justify-end pr-5">
        {React.Children.count(children) > 0
          ? React.Children.toArray(children)[React.Children.count(children) - 1]
          : null}
      </div>
    </nav>
  );
}

export function NavLink(props: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className="p-2 text-text hover:text-mantle hover:bg-text rounded-lg hover:rounded-lg hover:duration-300"
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
      className="p-2 text-text hover:text-subtext0 hover:duration-300"
    >
      <img src={imgSrc} alt={alt} />
    </Link>
  );
}

export function NavShoppingCart({ count }: { count?: number }) {
  return (
    <div>
      <Link
        href="/cart"
        className="p-2 text-text hover:text-subtext0 hover:duration-300"
      >
        <FontAwesomeIcon width="1.5rem" height="2rem" icon={faShoppingCart} />
        <div className="absolute h-5 w-5 bg-red rounded-xl top-8 right-3 flex items-center justify-center">
          <div className="text-text">{count}</div>
        </div>
      </Link>
    </div>
  );
}
