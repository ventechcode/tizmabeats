"use client";

import React, { useContext, useEffect, useState } from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { Beat } from "@/types";
import { ShoppingCartContext } from "@/app/providers";

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
  const shoppingCart = useContext(ShoppingCartContext);

  useEffect(() => {
    setToggle(isPlaying);
  }, [isPlaying]);

  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] bg-transparent border-2 dark:border-text w-full mx-4 sm:m-0 sm:w-auto h-auto rounded-xl py-3 px-3 sm:p-6">
        <CardItem translateZ="44" className="text-xl font-bold text-text">
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
            {doubleToTimeString(beat.length)}
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
          <CardItem
            translateZ={36}
            as="button"
            className={`px-4 py-2 rounded-xl bg-text text-crust ${
              shoppingCart?.contains(beat.id)
                ? "hover:bg-[#f38ba8]"
                : "duration-300"
            } text-xs font-bold w-24 h-8 duration-300`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
              if (shoppingCart?.contains(beat.id)) {
                shoppingCart?.removeFromCart(beat.id);
              } else {
                shoppingCart?.addToCart(beat);
              }
            }}
          >
            {shoppingCart?.contains(beat.id) ? (
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
            ) : isHovered ? (
              <p className="text-[11px]">Add to cart</p>
            ) : (
              `Buy ${beat.price}€`
            )}
          </CardItem>
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

function doubleToTimeString(doubleTime: number) {
  const minutes = Math.floor(doubleTime);
  const seconds = Math.round((doubleTime - minutes) * 100);
  return `${minutes}:${seconds.toString().padStart(2, "0")} min`;
}
