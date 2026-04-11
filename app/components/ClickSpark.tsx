"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface Spark {
  id: number;
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
  extraScale?: number;
}

export default function ClickSpark({
  sparkColor = "#ffffff",
  sparkSize = 32,
  sparkRadius = 70,
  sparkCount = 12,
  duration = 650,
  easing = "ease-out",
  extraScale = 1,
}: ClickSparkProps) {
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const apply = () => setFinePointer(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const rafRef = useRef<number>(0);
  const nextIdRef = useRef(0);
  const mouseRef = useRef({ x: -200, y: -200 });
  const isClickingRef = useRef(false);

  const easingFn = useCallback(
    (t: number): number => {
      switch (easing) {
        case "ease-in": return t * t;
        case "ease-out": return t * (2 - t);
        case "ease-in-out": return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default: return t;
      }
    },
    [easing]
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = performance.now();
    const { x, y } = mouseRef.current;

    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.strokeStyle = isClickingRef.current ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fill();

    sparksRef.current = sparksRef.current.filter((spark) => {
      const elapsed = now - spark.startTime;
      if (elapsed >= duration) return false;

      const progress = elapsed / duration;
      const eased = easingFn(progress);

      const dist = eased * sparkRadius * extraScale;
      const sx = spark.x + dist * Math.cos(spark.angle);
      const sy = spark.y + dist * Math.sin(spark.angle);
      const alpha = 1 - eased;
      const size = sparkSize * (1 - eased * 0.5);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = sparkColor;
      ctx.lineWidth = size * 0.15;
      ctx.lineCap = "round";

      const tailX = spark.x + (dist * 0.6) * Math.cos(spark.angle);
      const tailY = spark.y + (dist * 0.6) * Math.sin(spark.angle);
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(sx, sy);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(sx, sy, size * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = sparkColor;
      ctx.fill();

      ctx.restore();
      return true;
    });

    rafRef.current = requestAnimationFrame(draw);
  }, [sparkColor, sparkSize, sparkRadius, duration, easingFn, extraScale]);

  useEffect(() => {
    if (!finePointer) return;
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw, finePointer]);

  useEffect(() => {
    if (!finePointer) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const vv = window.visualViewport;
      canvas.width = vv?.width ?? window.innerWidth;
      canvas.height = vv?.height ?? window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    window.visualViewport?.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("resize", resize);
    };
  }, [finePointer]);

  useEffect(() => {
    if (!finePointer) return;
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [finePointer]);

  useEffect(() => {
    if (!finePointer) return;
    const onDown = () => { isClickingRef.current = true; };
    const onUp = () => { isClickingRef.current = false; };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [finePointer]);

  useEffect(() => {
    if (!finePointer) return;
    const handleClick = (e: MouseEvent) => {
      const angleStep = (2 * Math.PI) / sparkCount;
      const now = performance.now();
      for (let i = 0; i < sparkCount; i++) {
        sparksRef.current.push({
          id: nextIdRef.current++,
          x: e.clientX,
          y: e.clientY,
          angle: i * angleStep,
          startTime: now,
        });
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [sparkCount, finePointer]);

  if (!finePointer) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      aria-hidden="true"
    />
  );
}
