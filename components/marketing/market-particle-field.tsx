"use client";

import { useEffect, useRef } from "react";

type Particle = {
  baseX: number;
  baseY: number;
  depth: number;
  x: number;
  y: number;
  phase: number;
  speed: number;
  size: number;
  tone: "gold" | "amber" | "white";
  drift: number;
};

const tones = {
  gold: "255, 209, 102",
  amber: "255, 183, 3",
  white: "255, 253, 247"
};

function buildParticles(width: number, height: number) {
  const area = width * height;
  const count = Math.min(96, Math.max(42, Math.floor(area / 13000)));
  const particles: Particle[] = [];

  for (let index = 0; index < count; index += 1) {
    const progress = index / Math.max(1, count - 1);
    const onFlowLine = index % 3 !== 0;
    const baseX = onFlowLine ? progress * width : Math.random() * width;
    const wave =
      height * 0.52 +
      Math.sin(progress * Math.PI * 3.4) * height * 0.12 -
      progress * height * 0.22;
    const baseY = onFlowLine ? wave + (Math.random() - 0.5) * height * 0.22 : Math.random() * height;

    particles.push({
      baseX,
      baseY,
      depth: 0.55 + Math.random() * 1.45,
      x: baseX,
      y: baseY,
      phase: Math.random() * Math.PI * 2,
      speed: 0.006 + Math.random() * 0.014,
      size: 1 + Math.random() * 1.9,
      tone: index % 9 === 0 ? "white" : index % 4 === 0 ? "amber" : "gold",
      drift: 10 + Math.random() * 26
    });
  }

  return particles;
}

function drawFlowLine(context: CanvasRenderingContext2D, width: number, height: number, offset: number, alpha: number) {
  context.beginPath();
  context.moveTo(0, height * (0.58 + offset));

  for (let point = 0; point <= 10; point += 1) {
    const x = (point / 10) * width;
    const y =
      height * (0.58 + offset) +
      Math.sin(point * 0.9 + offset * 8) * height * 0.08 -
      (point / 10) * height * 0.26;
    context.lineTo(x, y);
  }

  context.strokeStyle = `rgba(255, 209, 102, ${alpha})`;
  context.lineWidth = 1;
  context.stroke();
}

function drawDepthFrame(context: CanvasRenderingContext2D, width: number, height: number, scrollOffset: number) {
  const centerX = width * 0.62;
  const centerY = height * 0.2 + (scrollOffset % 240) * 0.12;
  const sizes = [220, 360, 520];

  for (const [index, size] of sizes.entries()) {
    const offset = (scrollOffset * (0.025 + index * 0.01)) % size;
    context.save();
    context.translate(centerX, centerY + index * 90);
    context.rotate((-12 * Math.PI) / 180);
    context.strokeStyle = `rgba(255, 209, 102, ${0.045 - index * 0.008})`;
    context.lineWidth = 1;
    context.strokeRect(-size / 2 + offset * 0.08, -size / 5, size, size * 0.42);
    context.restore();
  }
}

export function MarketParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let particles: Particle[] = [];
    let frame = 0;
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let scrollOffset = window.scrollY;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = buildParticles(width, height);
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      const pulse = reducedMotion.matches ? 0.5 : (Math.sin(frame * 0.014) + 1) / 2;
      drawDepthFrame(context, width, height, scrollOffset);
      drawFlowLine(context, width, height, -0.06, 0.07 + pulse * 0.05);
      drawFlowLine(context, width, height, 0.04, 0.05 + pulse * 0.04);

      for (const particle of particles) {
        if (!reducedMotion.matches) {
          particle.phase += particle.speed;
          particle.x = particle.baseX + Math.sin(particle.phase * 1.6) * particle.drift + scrollOffset * 0.015 * particle.depth;
          particle.y = particle.baseY + Math.cos(particle.phase) * particle.drift * 0.42 - scrollOffset * 0.01 * particle.depth;

          if (particle.x > width + 30) particle.baseX = -30;
          if (particle.x < -40) particle.baseX = width + 30;
        }
      }

      for (let leftIndex = 0; leftIndex < particles.length; leftIndex += 1) {
        const left = particles[leftIndex];
        for (let rightIndex = leftIndex + 1; rightIndex < particles.length; rightIndex += 1) {
          const right = particles[rightIndex];
          const distance = Math.hypot(left.x - right.x, left.y - right.y);

          if (distance < 94) {
            context.beginPath();
            context.moveTo(left.x, left.y);
            context.lineTo(right.x, right.y);
            context.strokeStyle = `rgba(255, 209, 102, ${0.1 * (1 - distance / 94)})`;
            context.lineWidth = 1;
            context.stroke();
          }
        }
      }

      for (const particle of particles) {
        const color = tones[particle.tone];
        const glow = particle.tone === "white" ? 0.2 : 0.26;
        context.beginPath();
        context.arc(particle.x, particle.y, (particle.size + pulse * 0.7) * particle.depth, 0, Math.PI * 2);
        context.fillStyle = `rgba(${color}, ${glow})`;
        context.fill();
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size * 0.42, 0, Math.PI * 2);
        context.fillStyle = `rgba(${color}, 0.82)`;
        context.fill();
      }

      frame += 1;
      if (!reducedMotion.matches) {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    resize();
    draw();
    const handleScroll = () => {
      scrollOffset = window.scrollY;
    };
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    reducedMotion.addEventListener("change", draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
      reducedMotion.removeEventListener("change", draw);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-80"
      ref={canvasRef}
    />
  );
}
