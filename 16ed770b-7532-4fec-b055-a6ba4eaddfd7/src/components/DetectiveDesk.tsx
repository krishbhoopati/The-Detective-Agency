import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotaryPhone } from './RotaryPhone';
import { TeletypeManual } from './TeletypeManual';
import { Microphone } from './Microphone';
import { EvidenceRecorder } from './EvidenceRecorder';
import { ScamDetectionGame } from './ScamDetectionGame';
export function DetectiveDesk() {
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const [showChiefDialog, setShowChiefDialog] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const handleObjectClick = (title: string) => {
    setActiveToast(`Accessing ${title}...`);
    setTimeout(() => setActiveToast(null), 3000);
  };
  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">
      {/* Global CRT Scanlines */}
      <div className="absolute inset-0 scanlines z-50 pointer-events-none" />

      {/* Top Wall Section */}
      <div className="h-[12vh] w-full bg-wall border-b-8 border-stone-900 relative z-0 flex items-center justify-center shrink-0">
        <motion.div
          initial={{
            opacity: 0,
            y: -20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 1.0,
            delay: 0.2
          }}>
          
          <h1 className="font-retro text-xl sm:text-3xl text-yellow-500 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)] tracking-widest bg-black/60 px-6 py-3 border-4 border-yellow-700">
            THE DETECTIVE'S DESK
          </h1>
        </motion.div>
      </div>

      {/* Desk Surface Section */}
      <div className="flex-1 relative bg-wood-desk vignette-warm z-10 overflow-hidden">
        {/* Subtle Desk Decorations — tucked into corners */}
        {/* Coffee Ring — bottom-left corner */}
        <div className="absolute bottom-8 left-8 w-24 h-24 rounded-full border-[6px] border-[#4a2e15] opacity-25 z-0" />

        {/* Pencil — bottom edge, center */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-3 bg-[#eab308] border-2 border-[#854d0e] rotate-[5deg] z-0 flex opacity-60">
          <div className="w-5 h-full bg-[#fca5a5] border-r-2 border-[#854d0e]" />
          <div className="flex-1" />
          <div className="w-6 h-full bg-[#fde047] border-l-2 border-[#854d0e]" />
        </div>

        {/* Warm Desk Lamp Glow */}
        <div className="absolute top-[-5%] right-[-5%] w-[50%] h-[50%] pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,200,50,0.12)_0%,transparent_70%)] z-0" />

        {/* Clean 2x2 Grid Layout for Objects */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-4 p-6 sm:p-10 z-10">
          {/* Top-Left: Rotary Phone */}
          <div className="flex items-center justify-center">
            <RotaryPhone
              className=""
              onClick={() => setShowChiefDialog(true)} />
            
          </div>

          {/* Top-Right: Evidence Board */}
          <div className="flex items-center justify-center">
            <EvidenceRecorder className="" onClick={() => setShowGame(true)} />
          </div>

          {/* Bottom-Left: Teletype Manual */}
          <div className="flex items-center justify-center">
            <TeletypeManual
              className=""
              onClick={() => handleObjectClick('Teletype Manual')} />
            
          </div>

          {/* Bottom-Right: Microphone */}
          <div className="flex items-center justify-center">
            <Microphone
              className=""
              onClick={() => handleObjectClick('Microphone')} />
            
          </div>
        </div>
      </div>

      {/* The Chief's Dialog Box */}
      <AnimatePresence>
        {showChiefDialog &&
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
            y: 20
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
            y: 20
          }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 300
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[600px] z-[55]">
          
            <div className="relative bg-[#0000aa] p-6 sm:p-8 border-[6px] border-white shadow-retro-dialog">
              {/* Dialog Header */}
              <div className="absolute -top-6 left-6 bg-white px-4 py-2 border-[4px] border-black">
                <span className="font-retro text-sm sm:text-base text-black">
                  CHIEF
                </span>
              </div>

              <button
              onClick={() => setShowChiefDialog(false)}
              className="absolute top-3 right-3 w-10 h-10 bg-red-600 border-[4px] border-white text-white flex items-center justify-center hover:bg-red-500 font-retro text-sm sm:text-base"
              aria-label="Close dialog">
              
                X
              </button>

              <div className="flex flex-col sm:flex-row gap-6 mt-4 items-center sm:items-start">
                {/* Portrait */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-black border-[4px] border-white flex items-center justify-center overflow-hidden">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-stone-400 rounded-sm mt-6 relative">
                    <div className="absolute top-3 left-3 w-3 h-3 bg-black" />
                    <div className="absolute top-3 right-3 w-3 h-3 bg-black" />
                    <div className="absolute bottom-3 left-3 right-3 h-2 bg-black" />
                  </div>
                </div>

                <p className="font-typewriter text-white text-lg sm:text-2xl leading-relaxed">
                  "Welcome back to the Agency. You've got three stations to get
                  acquainted with before you take a case. The Teletype, the
                  Training Manual, and the Evidence Board. Take your time."
                </p>
              </div>

              <div className="absolute bottom-3 right-4 w-4 h-4 bg-white animate-pulse" />
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Scam Detection Game */}
      <AnimatePresence>
        {showGame && <ScamDetectionGame onClose={() => setShowGame(false)} />}
      </AnimatePresence>

      {/* Retro Toast Notification */}
      <AnimatePresence>
        {activeToast &&
        <motion.div
          initial={{
            opacity: 0,
            y: 50
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            y: 50
          }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black border-[6px] border-yellow-500 px-8 py-6 shadow-retro-dialog z-[55]">
          
            <p className="font-retro text-yellow-400 text-base sm:text-xl whitespace-nowrap">
              {'>'} {activeToast}
            </p>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}