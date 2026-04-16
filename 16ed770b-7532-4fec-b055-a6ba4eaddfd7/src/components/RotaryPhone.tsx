import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
interface RotaryPhoneProps {
  className?: string;
  onClick: () => void;
}
export function RotaryPhone({ className = '', onClick }: RotaryPhoneProps) {
  const [isRinging, setIsRinging] = useState(true);
  useEffect(() => {
    if (isRinging) {
      const timer = setTimeout(() => setIsRinging(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [isRinging]);
  const handleClick = () => {
    setIsRinging(false);
    onClick();
  };
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
        delay: 0.2
      }}
      onClick={handleClick}
      className={`group relative flex flex-col items-center focus:outline-none ${className}`}>
      
      {/* Ringing Glow */}
      <AnimatePresence>
        {isRinging &&
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 0.4,
            repeat: Infinity
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] border-[6px] border-yellow-400 rounded-3xl z-0" />

        }
      </AnimatePresence>

      {/* Phone Body */}
      <div
        className={`relative w-[260px] h-[160px] bg-gradient-to-b from-stone-800 via-stone-900 to-stone-950 border-[6px] border-stone-950 rounded-2xl shadow-retro transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-retro-hover group-hover:border-yellow-500 z-10 ${isRinging ? 'animate-ring' : ''}`}>
        
        {/* Top Highlight/Reflection */}
        <div className="absolute top-1 left-4 right-4 h-1 bg-stone-700 rounded-full opacity-50" />

        {/* Cradle Bumps */}
        <div className="absolute -top-4 left-10 w-12 h-6 bg-stone-900 border-[4px] border-stone-950 rounded-t-lg" />
        <div className="absolute -top-4 right-10 w-12 h-6 bg-stone-900 border-[4px] border-stone-950 rounded-t-lg" />

        {/* Handset */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[280px] h-[60px] flex items-center justify-between z-20 drop-shadow-xl">
          {/* Earpiece */}
          <div className="w-[60px] h-[50px] bg-stone-900 border-[4px] border-stone-950 rounded-xl shadow-inner relative">
            <div className="absolute inset-2 rounded-full border border-stone-700 opacity-50" />
          </div>
          {/* Handle Bar */}
          <div className="absolute left-1/2 -translate-x-1/2 w-[160px] h-[24px] bg-gradient-to-b from-stone-800 to-stone-950 border-y-[4px] border-stone-950" />
          {/* Mouthpiece */}
          <div className="w-[60px] h-[50px] bg-stone-900 border-[4px] border-stone-950 rounded-xl shadow-inner relative">
            <div className="absolute inset-2 rounded-full border border-stone-700 opacity-50" />
          </div>
        </div>

        {/* Rotary Dial */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[140px] h-[140px] bg-stone-200 border-[4px] border-stone-400 rounded-full flex items-center justify-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.5)]">
          <div className="w-[100px] h-[100px] bg-white rounded-full border-2 border-stone-300 relative shadow-md">
            {/* Finger holes and numbers */}
            {[...Array(10)].map((_, i) => {
              // Skip the bottom-right area for the finger stop
              if (i === 8 || i === 9) return null;
              const angle = i * 30 - 120;
              const number =
              i === 0 ?
              1 :
              i === 1 ?
              2 :
              i === 2 ?
              3 :
              i === 3 ?
              4 :
              i === 4 ?
              5 :
              i === 5 ?
              6 :
              i === 6 ?
              7 :
              i === 7 ?
              8 :
              i === 8 ?
              9 :
              0;
              return (
                <div
                  key={i}
                  className="absolute w-6 h-6 bg-stone-900 rounded-full shadow-inner flex items-center justify-center"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-34px)`
                  }}>
                  
                  {/* Number label inside the hole (simulating the number plate underneath) */}
                  <span
                    className="text-white font-retro text-[8px]"
                    style={{
                      transform: `rotate(${-angle}deg)`
                    }}>
                    
                    {number}
                  </span>
                </div>);

            })}

            {/* 9 and 0 holes */}
            <div
              className="absolute w-6 h-6 bg-stone-900 rounded-full shadow-inner flex items-center justify-center"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(120deg) translateY(-34px)`
              }}>
              
              <span
                className="text-white font-retro text-[8px]"
                style={{
                  transform: `rotate(-120deg)`
                }}>
                
                9
              </span>
            </div>
            <div
              className="absolute w-6 h-6 bg-stone-900 rounded-full shadow-inner flex items-center justify-center"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(150deg) translateY(-34px)`
              }}>
              
              <span
                className="text-white font-retro text-[8px]"
                style={{
                  transform: `rotate(-150deg)`
                }}>
                
                0
              </span>
            </div>

            {/* Center label */}
            <div className="absolute inset-0 m-auto w-10 h-10 bg-stone-100 rounded-full border-2 border-stone-300 flex items-center justify-center shadow-inner">
              <div className="w-5 h-1 bg-stone-400 rounded-full" />
            </div>

            {/* Finger Stop (Metal Tab) */}
            <div className="absolute bottom-1 right-1 w-8 h-3 bg-stone-400 border-2 border-stone-500 rounded-full rotate-45 shadow-md" />
          </div>
        </div>

        {/* Curly Cord (SVG) */}
        <svg
          className="absolute -bottom-10 -left-16 w-32 h-48 text-stone-900 drop-shadow-lg z-0"
          viewBox="0 0 100 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round">
          
          <path d="M80,10 C40,10 10,30 10,50 C10,70 50,80 50,100 C50,120 10,130 10,150 C10,170 30,190 60,190" />
        </svg>
      </div>

      {/* Label */}
      <div className="mt-8 bg-black/90 border-4 border-stone-700 px-4 py-2 rounded z-20 group-hover:border-yellow-400 transition-colors">
        <span className="font-retro text-yellow-400 text-sm sm:text-base whitespace-nowrap">
          {isRinging ? 'RING RING' : 'THE CHIEF'}
        </span>
      </div>
    </motion.button>);

}