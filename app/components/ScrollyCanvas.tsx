"use client";

import { useEffect, useRef, useState } from "react";
import {
  useScroll,
  useTransform,
  useMotionValueEvent,
  useSpring
} from "framer-motion";

const FRAME_COUNT = 41;

export default function ScrollyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [images, setImages] = useState<HTMLImageElement[]>([]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const boostedProgress = useTransform(scrollYProgress, (v) => Math.min(v * 1.75, 1));

  const smoothProgress = useSpring(boostedProgress, {
    stiffness: 48,
    damping: 46,
    mass: 0.65,
  });

  const frameIndex = useTransform(
    smoothProgress,
    [0, 1],
    [0, FRAME_COUNT - 1]
  );

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image();
      const frameNum = i.toString().padStart(2, "0");
      img.src = `/sequence/frame_${frameNum}_delay-0.066s.png`;

      img.onload = () => {
        loadedCount++;

        if (i === 0 && canvasRef.current) {
          drawFrame(img, canvasRef.current);
        }

        if (loadedCount === FRAME_COUNT) {
          setImages(loadedImages);
        }
      };

      loadedImages.push(img);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const vv = window.visualViewport;
      const w = vv?.width ?? window.innerWidth;
      const h = vv?.height ?? window.innerHeight;
      canvas.width = w;
      canvas.height = h;

      if (images.length > 0) {
        const index = Math.round(frameIndex.get());
        drawFrame(images[index], canvas);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("scroll", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("scroll", handleResize);
    };
  }, [images, frameIndex]);

  const drawFrame = (image: HTMLImageElement, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = image.width / image.height;

    let renderWidth, renderHeight, x, y;

    if (canvasRatio > imgRatio) {
      renderWidth = canvas.width;
      renderHeight = canvas.width / imgRatio;
      x = 0;
      y = (canvas.height - renderHeight) / 2;
    } else {
      renderHeight = canvas.height;
      renderWidth = canvas.height * imgRatio;
      y = 0;
      x = (canvas.width - renderWidth) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, x, y, renderWidth, renderHeight);
  };

  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (images.length > 0 && canvasRef.current) {
      const index = Math.round(latest);
      if (images[index]) {
        drawFrame(images[index], canvasRef.current);
      }
    }
  });

  return (
    <div ref={containerRef} className="h-[400vh] w-full min-w-0 max-w-[100vw] relative bg-[#101010] overflow-x-clip">
      <div className="sticky top-0 h-[100dvh] min-h-[100svh] max-h-[100dvh] w-full min-w-0 max-w-[100vw] overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full max-w-full block touch-pan-y" />
      </div>
    </div>
  );
}