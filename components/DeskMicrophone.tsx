"use client";

import { motion } from "framer-motion";

export function DeskMicrophone({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 0.5, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className={`relative flex flex-col items-center cursor-not-allowed ${className}`}
      aria-hidden="true"
    >
      {/* Microphone Body */}
      <div className="relative w-[130px] sm:w-[160px] h-[180px] sm:h-[220px] flex flex-col items-center justify-end">
        {/* Mic Head */}
        <div className="absolute top-0 w-20 sm:w-24 h-28 sm:h-32 bg-stone-300 border-[6px] border-stone-800 rounded-full shadow-retro overflow-hidden z-20">
          <div className="absolute inset-0 flex flex-col justify-evenly py-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full h-1 bg-stone-500 opacity-50" />
            ))}
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-4 bg-stone-400 border-y-2 border-stone-600" />
        </div>

        {/* Neck */}
        <div className="absolute top-24 sm:top-28 w-7 sm:w-8 h-10 sm:h-12 bg-stone-400 border-[4px] border-stone-800 rounded-sm z-10" />

        {/* Stand Pole */}
        <div className="w-5 sm:w-6 h-16 sm:h-20 bg-stone-500 border-x-[4px] border-stone-800 z-10" />

        {/* Base */}
        <div className="w-28 sm:w-32 h-9 sm:h-10 bg-stone-300 border-[6px] border-stone-800 rounded-full shadow-retro z-10" />

        {/* Cord */}
        <svg
          className="absolute bottom-4 -right-12 sm:-right-16 w-16 sm:w-20 h-10 sm:h-12 text-stone-800 drop-shadow-md z-0"
          viewBox="0 0 100 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M0,25 C30,25 40,40 60,40 C80,40 90,10 100,10" />
        </svg>
      </div>

      {/* Label */}
      <div className="mt-6 bg-black/90 border-4 border-stone-700 px-4 py-2 rounded z-20">
        <span className="font-retro text-stone-500 text-[10px] sm:text-sm whitespace-nowrap">
          COMING SOON
        </span>
      </div>
    </motion.div>
  );
}
