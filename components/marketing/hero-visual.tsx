"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Award, CandlestickChart, ShieldCheck, Sparkles } from "lucide-react";
import { useRef } from "react";

const chartBars = [36, 58, 44, 72, 52, 84, 62, 92, 70, 100] as const;
const instruments = ["XAUUSD", "US100", "BTC", "EURUSD"] as const;

function PhoneMockup({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "relative h-[270px] w-[150px] overflow-hidden border border-[rgba(255,209,102,0.28)] bg-[#090806] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
          : "relative h-[360px] w-[205px] overflow-hidden border border-[rgba(255,209,102,0.35)] bg-[#090806] p-4 shadow-[0_34px_100px_rgba(0,0,0,0.56)]"
      }
      style={{
        borderRadius: compact ? "28px" : "34px",
        transform: compact ? "rotateZ(10deg)" : "rotateZ(-8deg)"
      }}
    >
      <div className="absolute left-1/2 top-2 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />
      <div className="mt-7 flex items-center justify-between text-[10px] font-black uppercase text-[var(--muted)]">
        <span>TWC Desk</span>
        <span className="text-[var(--premium)]">Live</span>
      </div>
      <div className="mt-4 border border-[rgba(255,209,102,0.16)] bg-[rgba(255,209,102,0.06)] p-3">
        <p className="text-[10px] font-bold uppercase text-[var(--muted)]">Balance</p>
        <p className="mt-1 text-xl font-black text-white">AED 54,246</p>
      </div>
      <div className="mt-5 flex h-32 items-end gap-2 border-b border-l border-[rgba(255,209,102,0.2)] px-2">
        {chartBars.slice(0, compact ? 7 : chartBars.length).map((height, index) => (
          <motion.span
            animate={{ height: [`${height * 0.72}%`, `${height}%`, `${height * 0.82}%`] }}
            className="w-2 bg-[linear-gradient(180deg,#fff6cf,#ffb703)]"
            key={`${height}-${index}`}
            transition={{ delay: index * 0.08, duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
      <div className="mt-5 grid gap-2">
        {instruments.slice(0, compact ? 3 : 4).map((item, index) => (
          <div className="flex items-center justify-between border-b border-[rgba(255,209,102,0.12)] pb-2 text-[10px]" key={item}>
            <span className="font-black text-white">{item}</span>
            <span className="text-[var(--premium)]">+{(index + 1) * 0.7}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroVisual() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start end", "end start"] });
  const objectY = useTransform(scrollYProgress, [0, 1], [70, -90]);
  const objectRotate = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const backY = useTransform(scrollYProgress, [0, 1], [-40, 70]);

  return (
    <div
      aria-hidden="true"
      className="relative min-h-[560px] overflow-hidden [perspective:1200px] lg:min-h-[640px]"
      ref={rootRef}
    >
      <motion.div
        className="absolute inset-4 border border-[rgba(255,209,102,0.12)]"
        style={{
          y: backY,
          transform: "rotateX(64deg) rotateZ(-18deg)"
        }}
      />
      <motion.div
        animate={{ opacity: [0.35, 0.76, 0.35], x: ["-12%", "10%", "-12%"] }}
        className="absolute left-4 top-16 h-px w-[92%] bg-[linear-gradient(90deg,transparent,#ffd166,transparent)]"
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        animate={{ rotate: [0, 360] }}
        className="absolute right-8 top-14 h-32 w-32 border border-[rgba(255,209,102,0.18)]"
        style={{ transform: "rotateX(70deg)" }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        animate={{ y: [0, -16, 0], rotate: [-1.5, 1.5, -1.5] }}
        className="absolute left-1/2 top-6 z-20 flex -translate-x-1/2 items-center gap-3 border border-[rgba(255,209,102,0.22)] bg-[rgba(5,4,3,0.72)] px-4 py-3 text-xs font-black uppercase text-[var(--premium)] backdrop-blur-xl"
        transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="h-4 w-4" />
        Gold-led academy interface
      </motion.div>

      <motion.div
        className="absolute inset-x-0 bottom-10 top-24 mx-auto flex max-w-[520px] items-center justify-center [transform-style:preserve-3d]"
        style={{
          y: objectY,
          rotateZ: objectRotate
        }}
      >
        <motion.div
          animate={{ y: [0, -18, 0], rotateY: [-14, -4, -14] }}
          className="absolute left-[8%] top-[14%] z-10"
          transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <PhoneMockup compact />
        </motion.div>
        <motion.div
          animate={{ y: [0, 18, 0], rotateY: [14, 4, 14] }}
          className="absolute right-[2%] top-[2%] z-20"
          transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <PhoneMockup />
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          className="absolute bottom-8 left-10 z-30 w-52 border border-[rgba(255,209,102,0.28)] bg-[rgba(10,8,4,0.86)] p-4 backdrop-blur-xl"
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex items-center gap-2 text-[var(--premium)]">
            <Award className="h-4 w-4" />
            <span className="text-xs font-black uppercase">Founder-led</span>
          </div>
          <p className="mt-2 text-lg font-black text-white">A R Danish</p>
          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">Dubai, UAE • 9 years trading experience</p>
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0] }}
          className="absolute bottom-0 right-8 z-40 grid w-40 gap-2 border border-[rgba(255,209,102,0.28)] bg-[rgba(255,209,102,0.11)] p-4 backdrop-blur-xl"
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex items-center gap-2 text-[var(--premium)]">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-xs font-black uppercase">Risk First</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--text)]">
            <CandlestickChart className="h-4 w-4 text-[var(--premium)]" />
            <span className="text-xs font-bold">Gold • Forex • Crypto</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
