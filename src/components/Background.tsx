"use client";

import React from "react";

import { useTheme } from "next-themes";
import { flavorEntries } from "@catppuccin/palette";

import { WavyBackground } from "@/components/ui/wavy-background";

// Avoid re-rendering the background on parent component re-renders
const WavyBackgroundWrapper = React.memo(() => {
  const { theme } = useTheme();

  if (typeof window !== "undefined") {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      return null;
    }
  }

  const bgHexColor = () => {
    const flavorList = flavorEntries.map((entry) => entry[1]);
    const selectedFlavor = flavorList.find(
      (flavorItem) => flavorItem.name.toLowerCase() === theme
    );
    if (selectedFlavor) {
      return selectedFlavor.colors.base.hex;
    }
  };

  return <WavyBackground speed="slow" blur={5} backgroundFill={bgHexColor()} />;
});

WavyBackgroundWrapper.displayName = "WavyBackgroundWrapper";

export default WavyBackgroundWrapper;
