"use client";

import { useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

export default function DownloadButton({ item, beatName }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [redeemed, setRedeemed] = useState(false); 
  
  if (redeemed) {
    return (
      <button className="text-xs sm:text-sm text-green justify-self-end cursor-default">
        Redeemed <IoMdCheckmarkCircleOutline className="inline" size={16} />
      </button>
    );
  }

  return (
    <button
      className="text-xs sm:text-sm text-blue hover:text-blue/90 hover:underline justify-self-end duration-300"
      onClick={async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/download?id=${item.download.id}`);
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${beatName}-${item.licenseOption?.name}`;
          a.click();
          window.URL.revokeObjectURL(url);
        } finally {
          setIsLoading(false);
          setRedeemed(true);
        }
      }}
    >
      {isLoading ? (
        <div className="loading loading-dots loading-md text-blue mr-4"></div>
      ) : (
        "Download"
      )}
    </button>
  );
}