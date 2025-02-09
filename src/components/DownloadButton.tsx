"use client";

import { useState } from "react";

export default function DownloadButton({ item, beatName }: any) {
  const [isLoading, setIsLoading] = useState(false);

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