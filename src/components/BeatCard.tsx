"use client";

import React, { useContext, useEffect, useState } from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { Beat, BeatLicense } from "@/types";
import { ShoppingCartContext } from "@/app/providers";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { TbShoppingBagPlus } from "react-icons/tb";

export default function BeatCard({
  beat,
  play,
  isPlaying,
}: {
  beat: Beat;
  play: (beat: Beat, pause: boolean, next: boolean) => void;
  isPlaying: boolean;
}) {
  const [toggle, setToggle] = useState(isPlaying);
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Track dialog open state
  const shoppingCart = useContext(ShoppingCartContext);
  const [selectedLicense, setSelectedLicense] = useState<BeatLicense>(beat.licenses[0]);

  useEffect(() => {
    setToggle(isPlaying);
  }, [isPlaying]);

  return (
    <CardContainer
      className="inter-var"
      isDialogOpen={isDialogOpen}
    >
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] bg-transparent border-2 dark:border-text w-full mx-4 sm:m-0 sm:w-auto h-auto rounded-xl py-3 px-3 sm:p-6">
        <CardItem
          translateZ="44"
          className="text-xl font-bold text-text truncate overflow-hidden w-64"
        >
          {beat.name}
        </CardItem>
        <div className="flex flex-row justify-between mt-2">
          <CardItem
            as="p"
            translateZ="36"
            className="text-subtext0 text-sm max-w-sm"
          >
            {beat.genre}
          </CardItem>
          <CardItem
            as="p"
            translateZ="36"
            className="text-subtext0 text-sm max-w-sm"
          >
            {convertDuration(beat.length)}
          </CardItem>
          <CardItem
            as="p"
            translateZ="36"
            className="text-subtext0 text-sm max-w-sm"
          >
            {beat.bpm} bpm
          </CardItem>
          <CardItem
            as="p"
            translateZ="36"
            className="text-subtext0 text-sm max-w-sm"
          >
            {beat.songKey} Key
          </CardItem>
        </div>
        <div className="flex flex-col items-center justify-center p-5">
          <CardItem
            as="button"
            translateZ="61"
            onClick={() => {
              play(beat, true, false);
              setToggle(!toggle);
            }}
          >
            {!toggle ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-14 text-text hover:scale-110 duration-500"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-14 text-text hover:scale-110 duration-500"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM9 8.25a.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75h.75a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75H9Zm5.25 0a.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75H15a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75h-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </CardItem>
        </div>
        <div className="flex justify-between items-center">
          <Dialog
            onOpenChange={(open) => setIsDialogOpen(open)} // Update state when dialog opens/closes
          >
            {shoppingCart!.contains(beat.id) ? (
              <CardItem
                translateZ={36}
                as="button"
                className={`px-4 py-2 rounded-xl bg-text text-crust hover:bg-[#f38ba8] text-xs font-bold w-24 h-8 duration-300`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => shoppingCart?.removeFromCart(beat.id)}
              >
                <div>
                  {isHovered ? (
                    <div>
                      <p>Remove?</p>
                    </div>
                  ) : (
                    <div className="flex flex-row items-center justify-between -space-y-2">
                      <p>Added</p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6 pt-2"
                      >
                        <path
                          fillRule="evenodd"
                          d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </CardItem>
            ) : (
              <DialogTrigger>
                <CardItem
                  translateZ={36}
                  as="button"
                  className={`px-4 py-2 rounded-xl bg-text text-crust text-xs font-bold w-24 h-8 duration-300`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {isHovered ? (
                    <p className="text-[11px]">Add to cart</p>
                  ) : (
                    `Buy`
                  )}
                </CardItem>
              </DialogTrigger>
            )}
            <DialogContent className="bg-base border-none">
              <DialogHeader>
                <DialogTitle>Choose License</DialogTitle>
                <DialogDescription className="text-subtext0">
                  Select the license that best fits your needs
                </DialogDescription>
              </DialogHeader>
              <DialogClose />
              <div className="grid grid-cols-3 grid-rows-1 gap-x-2 flex-wrap">
                {beat.licenses.map((license: BeatLicense) => (
                  <div
                    onClick={() => {
                      setSelectedLicense(license);
                    }}
                    className={`h-20 ${selectedLicense.id == license.id ? "bg-mantle border-accentColor": ""} hover:bg-mantle hover:cursor-pointer border-2 rounded-md flex flex-col justify-around pl-2 py-1`}
                  >
                    <p className="text-md">{license.licenseOption.name}</p>
                    <p className="text-subtext1 text-sm">{license.price}€</p>
                    <p className="text-subtext0 text-[10px]">
                      {license.licenseOption.contents.map((s) => s).join(", ")}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center space-x-4">
                <div className="flex space-x-1">
                  <p className="font-semibold">Subtotal:</p>{" "}
                  <p>{selectedLicense.price}€</p>
                </div>
                <DialogTrigger>
                  <div
                    className="flex w-24 justify-around items-center bg-text text-crust rounded-md p-2 hover:bg-crust hover:text-text cursor-pointer duration-300"
                    onClick={() => {
                      if (shoppingCart?.contains(beat.id)) {
                        shoppingCart?.removeFromCart(beat.id);
                      } else {
                        shoppingCart?.addToCart(beat);
                      }
                    }}
                  >
                    <TbShoppingBagPlus className="h-7 w-7" />
                    <div className="font-semibold">Add</div>
                  </div>
                </DialogTrigger>
              </div>
            </DialogContent>
          </Dialog>
          <CardItem
            translateZ={36}
            className="px-4 py-2 rounded-xl text-xs text-subtext1"
          >
            MP3
          </CardItem>
          <CardItem
            translateZ={36}
            className="px-4 py-2 rounded-xl text-xs text-subtext1"
          >
            WAV
          </CardItem>
          <CardItem
            translateZ={36}
            className="px-4 py-2 rounded-xl text-xs text-subtext1"
          >
            FULL LICENCE
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}

function convertDuration(duration: number) {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")} min`;
}
