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
          ? "relative h-[240px] w-[134px] overflow-hidden border border-[rgba(255,209,102,0.28)] bg-[#090806] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.46)] sm:h-[286px] sm:w-[160px]"
          : "relative h-[318px] w-[178px] overflow-hidden border border-[rgba(255,209,102,0.35)] bg-[#090806] p-3 shadow-[0_30px_84px_rgba(0,0,0,0.54)] sm:h-[386px] sm:w-[220px] lg:h-[420px] lg:w-[236px] lg:p-4"
      }
      style={{
        borderRadius: compact ? "28px" : "36px",
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
        <p className="mt-1 text-lg font-black leading-tight text-white sm:text-xl lg:text-2xl">AED 54,246</p>
      </div>
      <div className="mt-4 flex h-24 items-end gap-1.5 border-b border-l border-[rgba(255,209,102,0.2)] px-2 sm:mt-5 sm:h-32 sm:gap-2">
        {chartBars.slice(0, compact ? 7 : chartBars.length).map((height, index) => (
          <motion.span
            animate={{ height: [`${height * 0.72}%`, `${height}%`, `${height * 0.82}%`] }}
            className="w-1.5 bg-[linear-gradient(180deg,#fff6cf,#ffb703)] sm:w-2"
            key={`${height}-${index}`}
            transition={{ delay: index * 0.08, duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
      <div className="mt-4 hidden gap-2 sm:grid">
        {instruments.slice(0, compact ? 2 : 3).map((item, index) => (
          <div className="flex items-center justify-between border-b border-[rgba(255,209,102,0.12)] pb-2 text-[10px]" key={item}>
            <span className="font-black text-white">{item}</span>
            <span className="text-[var(--premium)]">+{((index + 1) * 0.7).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroVisual() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start end", "end start"] });
  const phoneY = useTransform(scrollYProgress, [0, 1], [18, -24]);
  const backY = useTransform(scrollYProgress, [0, 1], [-24, 36]);

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-full max-w-[640px] overflow-hidden [perspective:1200px]"
      ref={rootRef}
    >
      <motion.div
        className="absolute inset-3 border border-[rgba(255,209,102,0.12)] sm:inset-4"
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

      <div className="relative z-10 grid min-h-[590px] content-between gap-5 px-3 py-5 sm:min-h-[680px] sm:gap-7 sm:p-6 lg:min-h-[660px] xl:min-h-[700px]">
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [-1, 1, -1] }}
          className="mx-auto flex max-w-full items-center gap-2 border border-[rgba(255,209,102,0.22)] bg-[rgba(5,4,3,0.78)] px-4 py-3 text-xs font-black uppercase text-[var(--premium)] backdrop-blur-xl sm:gap-3 sm:px-5"
          transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>Gold-led academy interface</span>
        </motion.div>

        <motion.div
          className="mx-auto grid w-full max-w-[560px] grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] items-end gap-2 [transform-style:preserve-3d] sm:gap-6"
          style={{ y: phoneY }}
        >
          <motion.div
            animate={{ y: [0, -12, 0], rotateY: [-10, -3, -10] }}
            className="flex justify-end pb-8 sm:pb-12"
            transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <PhoneMockup compact />
          </motion.div>
          <motion.div
            animate={{ y: [0, 12, 0], rotateY: [10, 3, 10] }}
            className="flex justify-start"
            transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <PhoneMockup />
          </motion.div>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            className="min-h-[116px] border border-[rgba(255,209,102,0.28)] bg-[rgba(10,8,4,0.86)] p-4 backdrop-blur-xl"
            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-2 text-[var(--premium)]">
              <Award className="h-4 w-4 shrink-0" />
              <span className="text-xs font-black uppercase">Founder-led</span>
            </div>
            <p className="mt-3 text-xl font-black leading-tight text-white">A R Danish</p>
            <p className="mt-2 text-xs leading-5 text-[var(--muted)]">Dubai, UAE • 9 years trading experience</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 6, 0] }}
            className="min-h-[116px] border border-[rgba(255,209,102,0.28)] bg-[rgba(255,209,102,0.11)] p-4 backdrop-blur-xl"
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-2 text-[var(--premium)]">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span className="text-xs font-black uppercase">Risk First</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[var(--text)]">
              <CandlestickChart className="h-4 w-4 shrink-0 text-[var(--premium)]" />
              <span className="text-sm font-bold leading-5">Gold • Forex • Crypto</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
