"use client";
import { cn } from "@/utils/cn";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: any;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}) => {
  const noise = createNoise3D();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundFillRef = useRef(backgroundFill); // Ref to store the latest backgroundFill value
  const [_, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);

  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.002;
      case "fast":
        return 0.007;
      default:
        return 0.001;
    }
  };

  const waveColors = colors ?? [
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ];

  let animationId: number;
  let nt = 0;

  const drawWave = (ctx: CanvasRenderingContext2D, n: number) => {
    nt += getSpeed();
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 50;
      ctx.strokeStyle = waveColors[i % waveColors.length];
      for (let x = 0; x < w; x += 5) {
        const y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx.lineTo(x, y + h * 0.61); // Adjust for height
      }
      ctx.stroke();
      ctx.closePath();
    }
  };

  const render = (ctx: CanvasRenderingContext2D) => {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    ctx.globalAlpha = waveOpacity || 0.5;
    ctx.fillStyle = backgroundFillRef.current || "black"; // Use the latest backgroundFill from the ref
    ctx.fillRect(0, 0, w, h);
    drawWave(ctx, 3);
    animationId = requestAnimationFrame(() => render(ctx));
  };

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        setCanvasContext(ctx);
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        ctx.filter = `blur(${blur}px)`;
        render(ctx); // Start the animation loop
        return ctx;
      }
    }
    return null;
  };

  useEffect(() => {
    const ctx = initCanvas();
    const handleResize = () => {
      if (ctx) {
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        ctx.filter = `blur(${blur}px)`;
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [blur, waveWidth, speed, colors]);

  // Update the backgroundFillRef whenever backgroundFill changes
  useEffect(() => {
    backgroundFillRef.current = backgroundFill;
  }, [backgroundFill]);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        containerClassName
      )}
    >
      <canvas
        className="inset-0 absolute hidden sm:block"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
