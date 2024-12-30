"use client";

import React, { useEffect, useState } from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faCirclePause } from "@fortawesome/free-solid-svg-icons";
import { Beat } from "@/types";

export default function BeatCard({
  beat,
  play,
  onBuy,
  isPlaying,
}: {
  beat: Beat;
  play: (beat: Beat, pause: boolean) => void;
  onBuy: (beat: Beat) => void;
  isPlaying: boolean;
}) {
  const [toggle, setToggle] = useState(isPlaying);
  console.log("isPlaying", isPlaying);

  useEffect(() => {
    setToggle(isPlaying);
  }, [isPlaying]);

  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-crust dark:border-white/[0.2] border-black/[0.1] w-full mr-3 ml-3 sm:m-0 sm:w-auto h-auto rounded-xl p-6 border  ">
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
              play(beat, true);
              setToggle(!toggle);
            }}
          >
            <FontAwesomeIcon
              icon={toggle ? faCirclePause : faCirclePlay}
              size="3x"
            />
          </CardItem>
        </div>
        <div className="flex justify-between items-center">
          <CardItem
            translateZ={36}
            as="button"
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
            onClick={() => onBuy(beat)}
          >
            Buy {beat.price}€
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
  const seconds = Math.round((doubleTime - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")} min`;
}
