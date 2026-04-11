"use client";

import { useEffect, useState } from "react";
import Particles from "./Particles";

export default function BackgroundParticles() {
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <Particles
      particleColors={["#9909dc", "#ffffff", "#4b2cdb"]}
      particleCount={isNarrow ? 380 : 1000}
      particleSpread={30}
      speed={0.5}
      particleBaseSize={isNarrow ? 120 : 150}
      moveParticlesOnHover
      alphaParticles={false}
      disableRotation
      pixelRatio={1}
    />
  );
}
