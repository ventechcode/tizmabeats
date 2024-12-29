"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";

export default function SkeletonBeatCard() {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-crust dark:border-white/[0.2] border-black/[0.1] w-full mr-3 ml-3 sm:m-0 sm:w-auto h-auto rounded-xl p-6 border animate-pulse">
        <div className="h-7 bg-gray-200 rounded-md dark:bg-gray-700/40 w-24"></div>
        <div className="flex flex-row justify-between mt-2">
          <CardItem
            as="p"
            translateZ="36"
            className="text-subtext0 text-sm max-w-sm"
          >
            <div className="h-5 bg-gray-200 rounded-md dark:bg-gray-700/40 w-14"></div>
          </CardItem>
          <CardItem
            as="p"
            translateZ="36"
            className="text-subtext0 text-sm max-w-sm"
          >
            <div className="h-5 bg-gray-200 rounded-md dark:bg-gray-700/40 w-14"></div>
          </CardItem>
          <CardItem
            as="p"
            translateZ="36"
            className="text-subtext0 text-sm max-w-sm"
          >
            <div className="h-5 bg-gray-200 rounded-md dark:bg-gray-700/40 w-14"></div>
          </CardItem>
          <CardItem
            as="p"
            translateZ="36"
            className="text-subtext0 text-sm max-w-sm"
          >
            <div className="h-5 bg-gray-200 rounded-md dark:bg-gray-700/40 w-14"></div>
          </CardItem>
        </div>
        <div className="flex flex-col items-center justify-center p-5">
          {/* <CardItem as="button" translateZ="61">
            <FontAwesomeIcon icon={faCirclePlay} size="3x" className="text-gray-200 dark:text-gray-700/40"/>
          </CardItem> */}
          <div className="h-12 w-12 bg-gray-200 rounded-full dark:bg-gray-700/40"></div>
        </div>
        <div className="flex justify-between items-center">
        <div className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700/40 text-transparent text-xs font-bold w-20 h-8"></div>
          <CardItem
            translateZ={36}
            className="px-4 py-2 rounded-xl text-xs text-subtext1"
          >
            <div className="h-4 bg-gray-200 rounded-md dark:bg-gray-700/40 w-8"></div>
          </CardItem>
          <CardItem
            translateZ={36}
            className="px-4 py-2 rounded-xl text-xs text-subtext1"
          >
            <div className="h-4 bg-gray-200 rounded-md dark:bg-gray-700/40 w-8"></div>
          </CardItem>
          <CardItem
            translateZ={36}
            className="px-4 py-2 rounded-xl text-xs text-subtext1"
          >
            <div className="h-4 bg-gray-200 rounded-md dark:bg-gray-700/40 w-20"></div>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
