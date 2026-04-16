import React from 'react';
import { motion } from 'framer-motion';
interface MicrophoneProps {
  className?: string;
  onClick: () => void;
}
export function Microphone({ className = '', onClick }: MicrophoneProps) {
  return (
    <motion.button
      initial={{
        opacity: 0,
        y: 50
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.6,
        delay: 0.6
      }}
      onClick={onClick}
      className={`group relative flex flex-col items-center focus:outline-none ${className}`}>
      
      {/* Microphone Body */}
      <div className="relative w-[160px] h-[220px] transition-all duration-300 group-hover:-translate-y-3 z-10 flex flex-col items-center justify-end">
        {/* Mic Head (Pill shape) */}
        <div className="absolute top-0 w-24 h-32 bg-stone-300 border-[6px] border-stone-800 rounded-full shadow-retro group-hover:shadow-retro-hover group-hover:border-yellow-500 transition-all overflow-hidden z-20">
          {/* Grille lines */}
          <div className="absolute inset-0 flex flex-col justify-evenly py-2">
            {[...Array(6)].map((_, i) =>
            <div key={i} className="w-full h-1 bg-stone-500 opacity-50" />
            )}
          </div>
          {/* Center band */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-4 bg-stone-400 border-y-2 border-stone-600" />
        </div>

        {/* Neck/Swivel */}
        <div className="absolute top-28 w-8 h-12 bg-stone-400 border-[4px] border-stone-800 rounded-sm z-10" />

        {/* Stand Pole */}
        <div className="w-6 h-20 bg-stone-500 border-x-[4px] border-stone-800 z-10" />

        {/* Base */}
        <div className="w-32 h-10 bg-stone-300 border-[6px] border-stone-800 rounded-full shadow-retro group-hover:shadow-retro-hover group-hover:border-yellow-500 transition-all z-10" />

        {/* Cord */}
        <svg
          className="absolute bottom-4 -right-16 w-20 h-12 text-stone-800 drop-shadow-md z-0"
          viewBox="0 0 100 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round">
          
          <path d="M0,25 C30,25 40,40 60,40 C80,40 90,10 100,10" />
        </svg>
      </div>

      {/* Label */}
      <div className="mt-6 bg-black/90 border-4 border-stone-700 px-4 py-2 rounded z-20 group-hover:border-yellow-400 transition-colors">
        <span className="font-retro text-yellow-400 text-sm sm:text-base whitespace-nowrap">
          MICROPHONE
        </span>
      </div>
    </motion.button>);

}