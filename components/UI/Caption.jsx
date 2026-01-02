'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function Caption({ show = true }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-15 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none"
        >
          <motion.p
            className="text-white/80 text-lg font-semibold tracking-wider   uppercase" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Explore the future of St. John Enterprises Global.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

