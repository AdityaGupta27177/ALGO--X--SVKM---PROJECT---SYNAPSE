import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface BookLoaderProps {
  onComplete: () => void;
}

const CodeBackground = () => {
  const codeString = `
import { Core } from '@sys/algo';
const SYNC_RATE = 0.05;
async function mount(matrix: Node[]) {
  for (let i=0; i<matrix.length; i++) {
    await matrix[i].init(SYNC_RATE);
    console.log('[SYS] Node active:', matrix[i].id);
  }
}
function executeSequence() {
  const mem = process.memoryUsage();
  return (mem.heapUsed / 1024 / 1024).toFixed(2) + 'MB';
}`;

  const repeatedCode = Array(30).fill(codeString).join('\n');

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 z-0 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">
      <motion.pre
        className="text-green-400 font-mono text-[10px] sm:text-xs font-bold leading-relaxed whitespace-pre select-none"
        initial={{ x: "0%", y: "-50%" }}
        animate={{ x: "-20%", y: "0%" }}
        transition={{ duration: 4, ease: "linear" }}
        style={{ width: "200%", minHeight: "200%" }}
      >
        <div className="flex gap-x-20">
           <div>{repeatedCode}</div>
           <div className="mt-20">{repeatedCode}</div>
           <div>{repeatedCode}</div>
           <div className="mt-40">{repeatedCode}</div>
           <div>{repeatedCode}</div>
        </div>
      </motion.pre>
    </div>
  );
};

export const BookLoader: React.FC<BookLoaderProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.3, duration: 0.5, ease: "easeInOut" }}
      onAnimationComplete={() => {}}
    >
      <CodeBackground />
      
      {/* 
        Align the container right slightly (translate-x-12) to compensate 
        for the left-opening mechanism so the *open* book looks perfectly centered.
      */}
      <div className="relative flex justify-center items-center h-64 perspective-[1500px] z-10 translate-x-8 sm:translate-x-12">
        <div className="relative w-32 h-44 sm:w-40 sm:h-56 [transform-style:preserve-3d]">
          
          {/* Back Cover (Bottom part when open) */}
          <div className="absolute inset-0 bg-blue-900 rounded-r-xl shadow-2xl border border-blue-800" />
          
          {/* Right Page (Static background page) */}
          <div className="absolute inset-y-1 right-1 left-2 bg-neutral-200 rounded-r-lg shadow-inner flex items-center justify-center">
            <span className="text-blue-900 font-bold opacity-30 text-xs sm:text-sm">SYNAPSE</span>
          </div>

          {/* Opening Pages (Middle) */}
          <motion.div
            className="absolute inset-y-1 right-1 left-2 bg-white rounded-r-lg shadow-sm origin-left border-l border-neutral-300"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: -160 }}
            transition={{ duration: 1.5, ease: [0.645, 0.045, 0.355, 1], delay: 0.6 }}
          />
          <motion.div
            className="absolute inset-y-1 right-1 left-2 bg-neutral-100 rounded-r-lg shadow-sm origin-left border-l border-neutral-300"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: -150 }}
            transition={{ duration: 1.5, ease: [0.645, 0.045, 0.355, 1], delay: 0.5 }}
          />
          <motion.div
            className="absolute inset-y-1 right-1 left-2 bg-white rounded-r-lg shadow-md origin-left border-l border-neutral-300 flex items-center justify-center"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: -140 }}
            transition={{ duration: 1.5, ease: [0.645, 0.045, 0.355, 1], delay: 0.4 }}
          >
            <div className="flex flex-col gap-2 p-2 opacity-20">
               <div className="w-16 h-2 bg-neutral-400 rounded-full" />
               <div className="w-20 h-2 bg-neutral-400 rounded-full" />
               <div className="w-14 h-2 bg-neutral-400 rounded-full" />
            </div>
          </motion.div>

          {/* Front Cover (Top part) */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 rounded-r-xl shadow-[inset_4px_0_15px_rgba(0,0,0,0.3)] origin-left flex items-center justify-center border border-blue-500 overflow-hidden"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: -170 }}
            transition={{ duration: 1.5, ease: [0.645, 0.045, 0.355, 1], delay: 0.2 }}
          >
            {/* Book Spine visual */}
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-blue-900/40 shadow-inner" />
            
            <div className="flex flex-col items-center">
              <span className="text-white font-black text-xl sm:text-2xl tracking-wider text-shadow-sm truncate px-4">
                ALGO-X
              </span>
            </div>
          </motion.div>
          
        </div>
      </div>

      <motion.div 
        className="mt-8 flex flex-col items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <span className="text-blue-500 font-bold tracking-[0.2em] uppercase text-sm mb-2">Initiating</span>
        <div className="w-48 h-1 bg-neutral-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-blue-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

    </motion.div>
  );
};
