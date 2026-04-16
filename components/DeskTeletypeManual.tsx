"use client";

import { motion } from "framer-motion";

interface DeskTeletypeManualProps {
  className?: string;
  onClick: () => void;
}

export function DeskTeletypeManual({ className = "", onClick }: DeskTeletypeManualProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      onClick={onClick}
      className={`group relative flex flex-col items-center focus:outline-none ${className}`}
      aria-label="Open Literacy Manual — LLM literacy field guide"
    >
      {/* Book Body */}
      <div className="relative w-[200px] sm:w-[260px] h-[270px] sm:h-[340px] bg-[#4a90a4] border-[6px] border-stone-900 rounded-lg shadow-retro transition-all duration-300 group-hover:-translate-y-3 group-hover:shadow-retro-hover group-hover:border-yellow-500 z-10 rotate-[-2deg] flex flex-col items-center pt-8 px-4">
        {/* Spiral Binding */}
        <div className="absolute -top-3 left-4 right-4 h-6 flex justify-between">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-3 sm:w-4 h-6 bg-stone-200 border-2 border-stone-800 rounded-full shadow-sm" />
          ))}
        </div>

        {/* Cover Text */}
        <h2 className="font-retro text-white text-base sm:text-xl text-center mt-4 drop-shadow-md leading-relaxed">
          TELETYPE
          <br />
          <span className="text-yellow-300 text-sm sm:text-lg">LLM LITERACY</span>
        </h2>

        {/* Computer Illustration */}
        <div className="mt-6 sm:mt-8 w-28 sm:w-32 h-24 sm:h-28 bg-[#d1c7b7] border-[4px] border-stone-800 rounded flex flex-col items-center p-2 shadow-inner">
          <div className="w-full h-14 sm:h-16 bg-stone-900 border-2 border-stone-700 rounded-sm relative overflow-hidden">
            <div className="absolute top-2 left-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <div className="absolute top-5 left-2 w-14 sm:w-16 h-1 bg-green-500/50" />
            <div className="absolute top-8 left-2 w-8 sm:w-10 h-1 bg-green-500/50" />
          </div>
          <div className="w-20 sm:w-24 h-4 bg-stone-400 border-2 border-stone-800 mt-2 rounded-sm flex justify-center items-center">
            <div className="w-14 sm:w-16 h-1 bg-stone-600" />
          </div>
        </div>

        {/* Subtitle */}
        <div className="mt-auto mb-6 text-center">
          <p className="font-typewriter text-stone-300 text-xs">
            VERSION 1.0
          </p>
        </div>

        {/* Page edges */}
        <div className="absolute top-2 -right-3 w-2 h-[95%] bg-stone-200 border-y-4 border-r-4 border-stone-800 rounded-r-md -z-10" />
        <div className="absolute -bottom-3 left-2 w-[95%] h-2 bg-stone-200 border-x-4 border-b-4 border-stone-800 rounded-b-md -z-10" />
      </div>

      {/* Label */}
      <div className="mt-6 bg-black/90 border-4 border-stone-700 px-4 py-2 rounded z-20 group-hover:border-yellow-400 transition-colors">
        <span className="font-retro text-yellow-400 text-[10px] sm:text-sm whitespace-nowrap">
          LITERACY MANUAL
        </span>
      </div>
    </motion.button>
  );
}
