'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineArrowLeft } from 'react-icons/ai';

export default function Caption({ 
  show = true, 
  selectedRegion = null, 
  onBackToRegion = null,
  regionGlowColor = null 
}) {
  return (
    <AnimatePresence mode="wait">
      {/* Caption - show when no region selected */}
      {show && !selectedRegion && (
        <motion.div
          key="caption"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-15 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none w-full text-center"
        >
          <motion.p
            className="text-white/80 text-lg font-semibold tracking-wider uppercase" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Explore the future of St. John Enterprises Global.
          </motion.p>
        </motion.div>
      )}

      {/* Back Button - show when region selected */}
      {selectedRegion && onBackToRegion && (
        <motion.button
          key="back-button"
          onClick={onBackToRegion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 w-fit flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700 transition-colors group z-50"
          style={{
            borderColor: regionGlowColor ? regionGlowColor + "40" : undefined,
          }}
        >
          <AiOutlineArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors shrink-0" />
          <span className="text-xs md:text-sm text-slate-400 group-hover:text-white transition-colors whitespace-nowrap">
            Back to All Regions
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

