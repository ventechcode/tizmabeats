import React from "react";

export default function Loading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center h-sreen bg-base w-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
}

