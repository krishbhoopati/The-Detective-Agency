"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DeskRotaryPhoneProps {
  className?: string;
  onClick: () => void;
}

export function DeskRotaryPhone({ className = "", onClick }: DeskRotaryPhoneProps) {
  const [isRinging, setIsRinging] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("phoneAnswered") === "true") {
      setIsRinging(false);
    }
  }, []);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRinging) {
      audioRef.current = new Audio("/audio/rotary-phone-ring.mp3");

      // The animation rings for 0.310 * 2900ms ≈ 900ms, then goes silent
      const playRing = () => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
        setTimeout(() => { audioRef.current?.pause(); }, 900);
      };

      playRing();
      intervalRef.current = setInterval(playRing, 2900);
    } else {
      audioRef.current?.pause();
      audioRef.current = null;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      audioRef.current?.pause();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRinging]);

  const handleClick = () => {
    sessionStorage.setItem("phoneAnswered", "true");
    setIsRinging(false);
    onClick();
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      onClick={handleClick}
      className={`group relative flex flex-col items-center focus:outline-none ${className}`}
      aria-label="Answer the phone — hear your onboarding briefing from the Chief"
    >
      {/* Ringing Glow — pulses 3 times then pauses */}
      <AnimatePresence>
        {isRinging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0, 0.9, 0, 0.9, 0, 0] }}
            transition={{
              duration: 2.9,
              times: [0, 0.052, 0.103, 0.155, 0.207, 0.259, 0.310, 1.0],
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] border-[6px] border-yellow-400 rounded-3xl z-0"
          />
        )}
      </AnimatePresence>

      {/* Phone Body — jumps 3 times then pauses, like a real phone */}
      <motion.div
        animate={isRinging ? { y: [0, -7, 0, -7, 0, -7, 0, 0], x: [0, -3, 3, -3, 3, -3, 0, 0] } : { y: 0, x: 0 }}
        transition={isRinging ? {
          duration: 2.9,
          times: [0, 0.052, 0.103, 0.155, 0.207, 0.259, 0.310, 1.0],
          repeat: Infinity,
          ease: "easeInOut",
        } : { duration: 0.2 }}
      >
      <div
        className={`relative w-[220px] sm:w-[260px] h-[140px] sm:h-[160px] bg-gradient-to-b from-stone-800 via-stone-900 to-stone-950 border-[6px] border-stone-950 rounded-2xl shadow-retro transition-[border-color,box-shadow] duration-300 group-hover:shadow-retro-hover group-hover:border-yellow-500 z-10`}
      >
        {/* Top Highlight */}
        <div className="absolute top-1 left-4 right-4 h-1 bg-stone-700 rounded-full opacity-50" />

        {/* Cradle Bumps */}
        <div className="absolute -top-4 left-10 w-12 h-6 bg-stone-900 border-[4px] border-stone-950 rounded-t-lg" />
        <div className="absolute -top-4 right-10 w-12 h-6 bg-stone-900 border-[4px] border-stone-950 rounded-t-lg" />

        {/* Handset */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[240px] sm:w-[280px] h-[60px] flex items-center justify-between z-20 drop-shadow-xl">
          <div className="w-[55px] sm:w-[60px] h-[46px] sm:h-[50px] bg-stone-900 border-[4px] border-stone-950 rounded-xl shadow-inner relative">
            <div className="absolute inset-2 rounded-full border border-stone-700 opacity-50" />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 w-[140px] sm:w-[160px] h-[24px] bg-gradient-to-b from-stone-800 to-stone-950 border-y-[4px] border-stone-950" />
          <div className="w-[55px] sm:w-[60px] h-[46px] sm:h-[50px] bg-stone-900 border-[4px] border-stone-950 rounded-xl shadow-inner relative">
            <div className="absolute inset-2 rounded-full border border-stone-700 opacity-50" />
          </div>
        </div>

        {/* Rotary Dial */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] sm:w-[140px] h-[120px] sm:h-[140px] bg-stone-200 border-[4px] border-stone-400 rounded-full flex items-center justify-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.5)]">
          <div className="w-[84px] sm:w-[100px] h-[84px] sm:h-[100px] bg-white rounded-full border-2 border-stone-300 relative shadow-md">
            {[...Array(8)].map((_, i) => {
              const angle = i * 30 - 120;
              const number = i + 1;
              return (
                <div
                  key={i}
                  className="absolute w-5 h-5 bg-stone-900 rounded-full shadow-inner flex items-center justify-center"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-28px)`,
                  }}
                >
                  <span
                    className="text-white font-retro text-[6px]"
                    style={{ transform: `rotate(${-angle}deg)` }}
                  >
                    {number}
                  </span>
                </div>
              );
            })}
            <div
              className="absolute w-5 h-5 bg-stone-900 rounded-full shadow-inner flex items-center justify-center"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) rotate(120deg) translateY(-28px)",
              }}
            >
              <span className="text-white font-retro text-[6px]" style={{ transform: "rotate(-120deg)" }}>9</span>
            </div>
            <div
              className="absolute w-5 h-5 bg-stone-900 rounded-full shadow-inner flex items-center justify-center"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) rotate(150deg) translateY(-28px)",
              }}
            >
              <span className="text-white font-retro text-[6px]" style={{ transform: "rotate(-150deg)" }}>0</span>
            </div>
            <div className="absolute inset-0 m-auto w-8 h-8 bg-stone-100 rounded-full border-2 border-stone-300 flex items-center justify-center shadow-inner">
              <div className="w-4 h-1 bg-stone-400 rounded-full" />
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-2 bg-stone-400 border-2 border-stone-500 rounded-full rotate-45 shadow-md" />
          </div>
        </div>

        {/* Curly Cord */}
        <svg
          className="absolute -bottom-10 -left-16 w-32 h-48 text-stone-900 drop-shadow-lg z-0"
          viewBox="0 0 100 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M80,10 C40,10 10,30 10,50 C10,70 50,80 50,100 C50,120 10,130 10,150 C10,170 30,190 60,190" />
        </svg>
      </div>
      </motion.div>

      {/* Label */}
      <div className="mt-8 bg-black/90 border-4 border-stone-700 px-4 py-2 rounded z-20 group-hover:border-yellow-400 transition-colors">
        <span className="font-retro text-yellow-400 text-[10px] sm:text-sm whitespace-nowrap">
          {isRinging ? "RING RING" : "THE CHIEF"}
        </span>
      </div>

      {/* Answer the phone prompt */}
      {isRinging && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="mt-2 bg-yellow-500 border-4 border-yellow-700 px-4 py-1.5"
        >
          <span className="font-retro text-black text-[9px] sm:text-xs whitespace-nowrap">
            ANSWER THE PHONE
          </span>
        </motion.div>
      )}
    </motion.button>
  );
}
