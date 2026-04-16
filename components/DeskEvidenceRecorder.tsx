"use client";

import { motion } from "framer-motion";

interface DeskEvidenceRecorderProps {
  className?: string;
  onClick: () => void;
}

export function DeskEvidenceRecorder({ className = "", onClick }: DeskEvidenceRecorderProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      onClick={onClick}
      className={`group relative flex flex-col items-center focus:outline-none ${className}`}
      aria-label="View Evidence Board — your closed cases"
    >
      <div className="relative w-[240px] sm:w-[300px] h-[300px] sm:h-[380px] bg-[#c4956a] border-[8px] border-[#5c3317] rounded-sm shadow-retro transition-all duration-300 group-hover:-translate-y-3 group-hover:shadow-retro-hover group-hover:border-yellow-500 z-10 overflow-hidden">
        {/* Cork Texture Overlay */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#8b5a2b_1px,transparent_1px)] [background-size:8px_8px]" />

        {/* Header Text */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 border-2 border-stone-800 shadow-sm rotate-[-2deg] z-10">
          <span className="font-retro text-stone-900 text-[8px] sm:text-xs tracking-widest">
            EVIDENCE BOARD
          </span>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-600 rounded-full border border-red-900 shadow-sm">
            <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/60 rounded-full" />
          </div>
        </div>

        {/* Red String Connections */}
        <svg
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
          style={{ filter: "drop-shadow(2px 2px 1px rgba(0,0,0,0.3))" }}
          aria-hidden="true"
        >
          <path d="M 60 100 Q 150 120 220 90" fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="4 2" />
          <path d="M 220 90 Q 180 200 80 220" fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="4 2" />
          <path d="M 60 100 Q 100 180 80 220" fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="4 2" />
        </svg>

        {/* Pinned Photo 1 */}
        <div className="absolute top-20 left-6 w-16 sm:w-20 h-20 sm:h-24 bg-white border-2 border-stone-300 p-1 shadow-md rotate-6 z-10">
          <div className="w-full h-12 sm:h-16 bg-stone-800" />
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-600 rounded-full border border-blue-900 shadow-sm">
            <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/60 rounded-full" />
          </div>
        </div>

        {/* Pinned Photo 2 */}
        <div className="absolute top-16 right-8 w-20 sm:w-24 h-16 sm:h-20 bg-white border-2 border-stone-300 p-1 shadow-md -rotate-6 z-10">
          <div className="w-full h-10 sm:h-12 bg-stone-700" />
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-green-600 rounded-full border border-green-900 shadow-sm">
            <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/60 rounded-full" />
          </div>
        </div>

        {/* Pinned Note */}
        <div className="absolute top-40 sm:top-48 left-10 w-24 sm:w-28 h-20 sm:h-24 bg-[#fef08a] border border-[#eab308] p-2 shadow-md -rotate-3 z-10">
          <div className="w-full h-1 bg-yellow-600/30 mb-2" />
          <div className="w-5/6 h-1 bg-yellow-600/30 mb-2" />
          <div className="w-full h-1 bg-yellow-600/30 mb-2" />
          <div className="w-2/3 h-1 bg-yellow-600/30" />
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-600 rounded-full border border-red-900 shadow-sm">
            <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/60 rounded-full" />
          </div>
        </div>

        {/* Case File Folder */}
        <div className="absolute bottom-4 right-4 w-32 sm:w-40 h-24 sm:h-28 bg-[#e8dcc5] border-2 border-[#c2b290] shadow-md rotate-3 z-10">
          <div className="absolute -top-4 left-2 w-14 sm:w-16 h-4 bg-[#e8dcc5] border-t-2 border-x-2 border-[#c2b290] rounded-t-sm" />
          <div className="absolute top-4 left-4 font-retro text-[8px] text-stone-800">
            CASE FILE
            <br />
            #404
          </div>
        </div>

        {/* VIEW FILES Stamp CTA */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-red-600 border-4 border-red-800 px-3 sm:px-4 py-2 rotate-[-10deg] shadow-lg z-20 group-hover:scale-110 group-hover:bg-red-500 transition-all duration-300">
          <span className="font-retro text-white text-[8px] sm:text-sm tracking-wider drop-shadow-md whitespace-nowrap">
            VIEW FILES
          </span>
        </div>
      </div>

      {/* Label */}
      <div className="mt-6 bg-black/90 border-4 border-stone-700 px-4 py-2 rounded z-20 group-hover:border-yellow-400 transition-colors">
        <span className="font-retro text-yellow-400 text-[10px] sm:text-sm whitespace-nowrap">
          EVIDENCE BOARD
        </span>
      </div>
    </motion.button>
  );
}
