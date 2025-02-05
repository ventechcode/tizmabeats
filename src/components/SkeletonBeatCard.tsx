"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";

export default function SkeletonBeatCard({ className }: { className?: string }) {
  return (
    <CardContainer className={`inter-var block w-96 h-64 ${className}`}>
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] bg-transparent border-2 dark:border-text w-full mx-4 sm:m-0 sm:w-auto h-auto rounded-xl py-3 px-3 sm:p-6 animate-pulse">
        <div className="h-7 rounded-md bg-gray-200 w-44"></div>
        <div className="flex flex-row justify-between mt-2">
          <CardItem translateZ="36" className="text-subtext0 text-sm max-w-sm">
            <div className="h-5 bg-gray-200 rounded-md w-14"></div>
          </CardItem>
          <CardItem translateZ="36" className="text-subtext0 text-sm max-w-sm">
            <div className="h-5 bg-gray-200 rounded-md w-14"></div>
          </CardItem>
          <CardItem translateZ="36" className="text-subtext0 text-sm max-w-sm">
            <div className="h-5 bg-gray-200 rounded-md w-14"></div>
          </CardItem>
          <CardItem translateZ="36" className="text-subtext0 text-sm max-w-sm">
            <div className="h-5 bg-gray-200 rounded-md w-14"></div>
          </CardItem>
        </div>
        <div className="flex flex-col items-center justify-center p-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-14 text-gray-200"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex justify-between items-center">
          <div className="px-4 py-2 rounded-xl bg-gray-200 text-transparent text-xs font-bold w-24 h-8"></div>
          <CardItem
            translateZ={36}
            className="px-4 py-2 rounded-xl text-xs text-subtext1"
          >
            <div className="h-4 bg-gray-200 rounded-md w-10"></div>
          </CardItem>
          <CardItem
            translateZ={36}
            className="px-4 py-2 rounded-xl text-xs text-subtext1"
          >
            <div className="h-4 bg-gray-200 rounded-md w-10"></div>
          </CardItem>
          <CardItem
            translateZ={36}
            className="px-4 py-2 rounded-xl text-xs text-subtext1"
          >
            <div className="h-4 bg-gray-200 rounded-md w-14"></div>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
