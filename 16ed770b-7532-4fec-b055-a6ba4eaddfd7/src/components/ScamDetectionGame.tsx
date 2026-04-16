import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, ArrowRight, X } from 'lucide-react';
interface Case {
  id: number;
  type: 'email' | 'text' | 'call';
  from: string;
  subject: string;
  content: string;
  isScam: boolean;
  explanation: string;
  clues: string[];
}
const CASES: Case[] = [
{
  id: 1,
  type: 'email',
  from: 'support@amaz0n-security.net',
  subject: 'URGENT: Your account has been compromised!',
  content:
  'Dear Valued Customer,\n\nWe detected unusual activity on your account. Your account will be SUSPENDED within 24 hours unless you verify your identity immediately.\n\nClick here to verify: http://amaz0n-secure-login.com/verify\n\nPlease provide your password and credit card number to confirm your identity.\n\nAmazon Security Team',
  isScam: true,
  explanation:
  'This is a phishing scam! Amazon would never ask for your password or credit card via email.',
  clues: [
  'Misspelled domain (amaz0n with a zero)',
  'Creates false urgency',
  'Asks for password & credit card',
  'Suspicious link URL']

},
{
  id: 2,
  type: 'text',
  from: '+1 (555) 234-5678',
  subject: 'Text Message',
  content:
  "Hi Grandma! It's your grandson. I'm in trouble and need $500 right away. I got arrested and need bail money. Please don't tell Mom and Dad. Can you send money via gift cards? I'll pay you back I promise. Text me back at this number.",
  isScam: true,
  explanation:
  'This is the classic "grandparent scam." Scammers pretend to be a relative in trouble to get money, often via gift cards which are untraceable.',
  clues: [
  "Doesn't use your grandson's name",
  'Asks you not to tell family',
  'Requests gift cards (untraceable)',
  'Creates urgency and panic']

},
{
  id: 3,
  type: 'email',
  from: 'noreply@library.cityofspringfield.gov',
  subject: 'Your library books are due soon',
  content:
  'Hello,\n\nThis is a friendly reminder that you have 2 books due back to Springfield Public Library by March 15th.\n\n- "The Great Gatsby" by F. Scott Fitzgerald\n- "Cooking for One" by Mary Berry\n\nYou can renew online at library.cityofspringfield.gov or call us at (555) 123-4567.\n\nHappy reading!\nSpringfield Public Library',
  isScam: false,
  explanation:
  "This is a legitimate library reminder. It uses an official .gov domain, doesn't ask for personal information, and provides a real phone number.",
  clues: [
  'Official .gov email domain',
  'No urgent threats',
  "Doesn't ask for personal info",
  'Provides real contact info']

},
{
  id: 4,
  type: 'call',
  from: 'Unknown Number',
  subject: 'Phone Call Transcript',
  content:
  '"Hello, this is Agent Johnson from the IRS. We have found serious errors in your tax return and there is a warrant out for your arrest. You must pay $3,000 immediately using iTunes gift cards to avoid being arrested today. Do not hang up or officers will be sent to your home."',
  isScam: true,
  explanation:
  'The IRS NEVER calls to demand immediate payment, never threatens arrest over the phone, and never accepts gift cards as payment.',
  clues: [
  'IRS never calls demanding payment',
  'Threatens immediate arrest',
  'Demands gift card payment',
  'Creates extreme urgency']

}];

interface ScamDetectionGameProps {
  onClose: () => void;
}
export function ScamDetectionGame({ onClose }: ScamDetectionGameProps) {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [answer, setAnswer] = useState<'scam' | 'legit' | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const currentCase = CASES[currentCaseIndex];
  const handleAnswer = (choice: 'scam' | 'legit') => {
    setAnswer(choice);
    setShowResult(true);
    const isCorrect =
    choice === 'scam' && currentCase.isScam ||
    choice === 'legit' && !currentCase.isScam;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };
  const handleNext = () => {
    if (currentCaseIndex < CASES.length - 1) {
      setCurrentCaseIndex((prev) => prev + 1);
      setAnswer(null);
      setShowResult(false);
    } else {
      setGameOver(true);
    }
  };
  const handleRestart = () => {
    setCurrentCaseIndex(0);
    setAnswer(null);
    setShowResult(false);
    setScore(0);
    setGameOver(false);
  };
  const isCorrect =
  answer && (
  answer === 'scam' && currentCase.isScam ||
  answer === 'legit' && !currentCase.isScam);
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      exit={{
        opacity: 0
      }}
      className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4"
      onClick={onClose}>
      
      <motion.div
        initial={{
          scale: 0.9,
          y: 30
        }}
        animate={{
          scale: 1,
          y: 0
        }}
        exit={{
          scale: 0.9,
          y: 30
        }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 300
        }}
        className="relative w-full max-w-[800px] max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border-[6px] border-yellow-600 shadow-retro-dialog"
        onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="bg-stone-900 border-b-4 border-yellow-600 p-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <ShieldAlert className="text-red-500" size={32} />
            <h2 className="font-retro text-yellow-400 text-sm sm:text-lg">
              SCAM DETECTION
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-retro text-green-400 text-sm">
              SCORE: {score}/{CASES.length}
            </span>
            <span className="font-retro text-stone-400 text-xs">
              CASE {currentCaseIndex + 1}/{CASES.length}
            </span>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-red-600 border-4 border-red-800 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
              aria-label="Close game">
              
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Game Content */}
        <div className="p-6 sm:p-8">
          {!gameOver ?
          <>
              {/* Case Display */}
              <div className="mb-8">
                {/* Type Badge */}
                <div className="inline-block bg-stone-800 border-2 border-stone-600 px-3 py-1 mb-4">
                  <span className="font-retro text-stone-300 text-xs uppercase">
                    {currentCase.type === 'email' ?
                  '📧 EMAIL' :
                  currentCase.type === 'text' ?
                  '💬 TEXT MESSAGE' :
                  '📞 PHONE CALL'}
                  </span>
                </div>

                {/* Message Card */}
                <div className="bg-white border-4 border-stone-300 p-6 shadow-lg">
                  <div className="border-b-2 border-stone-200 pb-3 mb-4">
                    <p className="font-typewriter text-stone-600 text-base mb-1">
                      <strong className="text-stone-900">From:</strong>{' '}
                      {currentCase.from}
                    </p>
                    <p className="font-typewriter text-stone-600 text-base">
                      <strong className="text-stone-900">Subject:</strong>{' '}
                      {currentCase.subject}
                    </p>
                  </div>
                  <p className="font-typewriter text-stone-900 text-lg sm:text-xl leading-relaxed whitespace-pre-line">
                    {currentCase.content}
                  </p>
                </div>
              </div>

              {/* Answer Buttons */}
              {!showResult &&
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <button
                onClick={() => handleAnswer('scam')}
                className="flex-1 bg-red-700 border-[6px] border-red-900 p-6 hover:bg-red-600 transition-colors group">
                
                    <div className="flex items-center justify-center gap-3">
                      <ShieldAlert size={32} className="text-white" />
                      <span className="font-retro text-white text-base sm:text-lg">
                        IT'S A SCAM!
                      </span>
                    </div>
                  </button>
                  <button
                onClick={() => handleAnswer('legit')}
                className="flex-1 bg-green-700 border-[6px] border-green-900 p-6 hover:bg-green-600 transition-colors group">
                
                    <div className="flex items-center justify-center gap-3">
                      <ShieldCheck size={32} className="text-white" />
                      <span className="font-retro text-white text-base sm:text-lg">
                        LOOKS SAFE
                      </span>
                    </div>
                  </button>
                </div>
            }

              {/* Result */}
              <AnimatePresence>
                {showResult &&
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                className={`border-[6px] p-6 mb-6 ${isCorrect ? 'bg-green-900/50 border-green-500' : 'bg-red-900/50 border-red-500'}`}>
                
                    <h3
                  className={`font-retro text-lg mb-4 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  
                      {isCorrect ? '✓ CORRECT!' : '✗ WRONG!'}
                    </h3>
                    <p className="font-typewriter text-white text-lg sm:text-xl leading-relaxed mb-4">
                      {currentCase.explanation}
                    </p>
                    <div className="mt-4">
                      <h4 className="font-retro text-yellow-400 text-sm mb-3">
                        CLUES TO LOOK FOR:
                      </h4>
                      <ul className="space-y-2">
                        {currentCase.clues.map((clue, i) =>
                    <li
                      key={i}
                      className="font-typewriter text-stone-300 text-base sm:text-lg flex items-start gap-2">
                      
                            <span className="text-yellow-500 shrink-0">•</span>{' '}
                            {clue}
                          </li>
                    )}
                      </ul>
                    </div>

                    <button
                  onClick={handleNext}
                  className="mt-6 bg-yellow-600 border-4 border-yellow-800 px-8 py-4 hover:bg-yellow-500 transition-colors flex items-center gap-3 mx-auto">
                  
                      <span className="font-retro text-white text-base">
                        {currentCaseIndex < CASES.length - 1 ?
                    'NEXT CASE' :
                    'SEE RESULTS'}
                      </span>
                      <ArrowRight size={24} className="text-white" />
                    </button>
                  </motion.div>
              }
              </AnimatePresence>
            </> /* Game Over Screen */ :

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            className="text-center py-8">
            
              <h2 className="font-retro text-yellow-400 text-2xl sm:text-3xl mb-8">
                CASE CLOSED
              </h2>

              <div className="inline-block bg-stone-900 border-[6px] border-yellow-600 p-8 mb-8">
                <p className="font-retro text-stone-400 text-sm mb-4">
                  FINAL SCORE
                </p>
                <p className="font-retro text-6xl sm:text-7xl mb-4">
                  <span
                  className={
                  score >= 3 ?
                  'text-green-400' :
                  score >= 2 ?
                  'text-yellow-400' :
                  'text-red-400'
                  }>
                  
                    {score}
                  </span>
                  <span className="text-stone-600">/{CASES.length}</span>
                </p>
                <p className="font-typewriter text-xl text-stone-300">
                  {score === CASES.length ?
                '"Outstanding work, Detective!"' :
                score >= 3 ?
                '"Good instincts. Keep sharp."' :
                score >= 2 ?
                '"Not bad, but stay vigilant."' :
                '"We need more training, Detective."'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                onClick={handleRestart}
                className="bg-yellow-600 border-4 border-yellow-800 px-8 py-4 hover:bg-yellow-500 transition-colors">
                
                  <span className="font-retro text-white text-base">
                    PLAY AGAIN
                  </span>
                </button>
                <button
                onClick={onClose}
                className="bg-stone-700 border-4 border-stone-900 px-8 py-4 hover:bg-stone-600 transition-colors">
                
                  <span className="font-retro text-white text-base">
                    BACK TO DESK
                  </span>
                </button>
              </div>
            </motion.div>
          }
        </div>
      </motion.div>
    </motion.div>);

}