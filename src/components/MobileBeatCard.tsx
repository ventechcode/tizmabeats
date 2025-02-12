"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import type { Beat, BeatLicense } from "@/types";
import { ShoppingCartContext } from "@/app/providers";
import { useGlobalAudioPlayer } from "@/hooks/useAudioPlayer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TbShoppingBagPlus } from "react-icons/tb";

export default function MobileBeatCard({
  beat,
  className,
}: {
  beat: Beat;
  className?: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const shoppingCart = useContext(ShoppingCartContext);
  const [selectedLicense, setSelectedLicense] = useState<BeatLicense>(
    beat.licenses[0]
  );
  const audioPlayer = useGlobalAudioPlayer();

  const titleRef = useRef<HTMLParagraphElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  const convertDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleAddToCart = () => {
    shoppingCart?.addToCart({
      id: selectedLicense?.id,
      name: beat.name,
      license: selectedLicense!,
      price: selectedLicense?.price,
      quantity: 1,
    });
    setIsDialogOpen(false);
  };

  // Dynamic title animation setup
  useEffect(() => {
    const checkOverflow = () => {
      if (titleRef.current && titleContainerRef.current) {
        const titleWidth = titleRef.current.scrollWidth;
        const containerWidth = titleContainerRef.current.clientWidth;
        const isOverflowing = titleWidth > containerWidth;
        setShouldScroll(isOverflowing);

        // Set CSS custom properties for dynamic animation
        titleContainerRef.current.style.setProperty(
          "--scroll-distance",
          `-${titleWidth - containerWidth}px`
        );
        titleContainerRef.current.style.setProperty(
          "--scroll-duration",
          `${titleWidth / 20}s` // 50px per second scroll speed
        );
      }
    };

    // Initial check
    checkOverflow();

    // Setup ResizeObserver for responsive behavior
    const resizeObserver = new ResizeObserver(checkOverflow);
    if (titleContainerRef.current) {
      resizeObserver.observe(titleContainerRef.current);
    }
    if (titleRef.current) {
      resizeObserver.observe(titleRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [audioPlayer.beat?.name, audioPlayer.beat]);

  return (
    <div
      className={`flex items-center justify-between space-x-2 py-2 px-2 bg-surface0 rounded-lg mx-2 h-18 ${className}`}
    >
      <div className="flex items-center space-x-2">
        <button
          onClick={() => {
            if (audioPlayer?.isPlaying(beat)) {
              audioPlayer?.pause(beat);
            } else {
              audioPlayer?.play(beat);
            }
          }}
          className="text-text transition-colors flex-shrink-0"
        >
          {audioPlayer?.isPlaying(beat) ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-12 h-12"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM9 8.25a.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75h.75a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75H9Zm5.25 0a.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75H15a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75h-.75Z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-12 h-12"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
        <div ref={titleContainerRef} className="overflow-hidden">
          <h2
            ref={titleRef}
            className={`font-semibold text-text w-48 xs:w-64 whitespace-nowrap ${
              shouldScroll ? "marquee-animate" : ""
            }`}
          >
            {beat.name}
          </h2>
          <div className="flex text-xs text-subtext0 space-x-2">
            <span>{beat.genre}</span>
            <span>•</span>
            <span>{beat.bpm} bpm</span>
            <span>•</span>
            <span>{beat.songKey}</span>
          </div>
        </div>
      </div>
      <Dialog onOpenChange={(open) => setIsDialogOpen(open)}>
        {shoppingCart!.contains(beat) ? (
          <button
            className="px-3 py-1 rounded-full bg-mocha-red text-text text-xs font-bold flex-shrink-0"
            onClick={() => shoppingCart?.removeFromCart(beat)}
          >
            Remove
          </button>
        ) : (
          <DialogTrigger>
            <button className="h-9 w-16 px-4 py-2 rounded-full bg-text text-crust text-xs font-bold flex-shrink-0">
              Buy
            </button>
          </DialogTrigger>
        )}
        <DialogContent className="bg-base border-none text-text w-[90%] max-w-md mx-auto rounded-lg">
          <DialogHeader>
            <DialogTitle>Choose License for {beat.name}</DialogTitle>
            <DialogDescription className="text-subtext0 text-xs">
              Select the license that best fits your needs
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            {beat.licenses.map((license: BeatLicense) => (
              <div
                key={license.id}
                onClick={() => {
                  setSelectedLicense(license);
                  beat.selectedLicense = license;
                }}
                className={`p-3 ${
                  selectedLicense?.id == license.id
                    ? "bg-mantle border-accentColor"
                    : "border-text"
                } border rounded-md flex justify-between items-center cursor-pointer`}
              >
                <div>
                  <p className="text-sm font-medium text-text">
                    {license?.licenseOption?.name}
                  </p>
                  <p className="text-xs text-subtext0">
                    {license?.licenseOption?.contents.join(", ")}
                  </p>
                </div>
                <p className="text-sm font-semibold">{license.price}€</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm">
              <span className="font-medium">Subtotal:</span>
              <span className="ml-2 font-semibold">
                {selectedLicense?.price}€
              </span>
            </div>
            <DialogTrigger>
              <button
                className="flex items-center justify-center bg-text text-crust rounded-full px-4 py-2 text-sm font-semibold"
                onClick={handleAddToCart}
              >
                <TbShoppingBagPlus className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
            </DialogTrigger>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
