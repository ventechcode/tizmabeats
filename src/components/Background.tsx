"use client";

import React from "react";
import { useTheme } from "next-themes";
import { flavorEntries } from "@catppuccin/palette";
import { WavyBackground } from "@/components/ui/wavy-background";

// Memoize the component based on theme prop and isMobile state
const WavyBackgroundWrapper = React.memo(({ theme }: { theme: string | undefined }) => {
  const [isMobile, setIsMobile] = React.useState(false);

  // Handle window resize and initial mobile check
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile(); // Initial check
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Memoize background color calculation based on theme
  const bgHexColor = React.useMemo(() => {
    const flavorList = flavorEntries.map((entry) => entry[1]);
    const selectedFlavor = flavorList.find(
      (flavorItem) => flavorItem.name.toLowerCase() === theme
    );
    return selectedFlavor?.colors.base.hex;
  }, [theme]);

  if (isMobile) {
    return null;
  }

  return <WavyBackground speed="slow" blur={5} backgroundFill={bgHexColor} />;
});

WavyBackgroundWrapper.displayName = "WavyBackgroundWrapper";

// Parent component that handles theme subscription
const Background = () => {
  const { theme } = useTheme();
  return <WavyBackgroundWrapper theme={theme} />;
};

export default Background;