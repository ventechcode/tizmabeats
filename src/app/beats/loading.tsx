import React from "react";
import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-red-500 text-6xl">Loading...</h1>
      <Spinner size="lg" />
    </div>
  );
}


