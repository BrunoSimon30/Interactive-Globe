'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineClose, AiOutlineArrowLeft } from 'react-icons/ai';
import { useEffect } from 'react';
import Image from 'next/image';

export default function SubdivisionModal({ subdivision, region, isOpen, onClose, onBackToRegion }) {
  // Option 1: ESC key support
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onBackToRegion();  // ESC = back to region
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onBackToRegion]);

  if (!isOpen || !subdivision) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 pointer-events-auto overflow-y-auto"
        style={{ zIndex: 100 }}  // Explicit z-index to ensure it's above everything
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-gradient-to-br from-slate-900 to-slate-950 rounded-lg md:rounded-2xl border border-slate-800 shadow-2xl overflow-hidden my-auto"
          style={{
            boxShadow: `0 0 60px ${region?.glowColor || '#ffffff'}20, 0 0 100px ${region?.glowColor || '#ffffff'}10`
          }}
        >
          {/* Accent Border */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background: `linear-gradient(90deg, transparent, ${region?.glowColor || '#ffffff'}, transparent)`
            }}
          />

          {/* Close Button - Just close modal */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-slate-800/95 hover:bg-slate-800 border border-slate-700 transition-colors z-30 shadow-lg"
            style={{ zIndex: 30 }}  // Explicit z-index above content
          >
            <AiOutlineClose className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
          </button>

          {/* Option 2: Back to Region Button */}
          <button
            onClick={onBackToRegion}
            className="absolute top-2 left-2 md:top-4 md:left-4 flex items-center gap-1 md:gap-2 px-2 py-1.5 md:px-4 md:py-2 rounded-lg bg-slate-800/95 hover:bg-slate-800 border transition-colors z-30 group shadow-lg"
            style={{
              borderColor: region?.glowColor + '40',
              zIndex: 30  // Explicit z-index above content
            }}
          >
            <AiOutlineArrowLeft className="w-3 h-3 md:w-4 md:h-4 text-slate-400 group-hover:text-white transition-colors flex-shrink-0" />
            <span className="text-xs md:text-sm text-slate-400 group-hover:text-white transition-colors hidden sm:inline">
              Back to {region?.name || 'Region'}
            </span>
            <span className="text-xs md:text-sm text-slate-400 group-hover:text-white transition-colors sm:hidden">
              Back
            </span>
          </button>

          {/* Content - Padding top zyada taaki buttons ke neeche space ho */}
          <div className="px-4 py-6 pt-16 md:px-12 md:py-12 md:pt-24">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4 md:mb-6"
            >
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div
                  className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: region?.glowColor || '#ffffff' }}
                />
                <span className="text-xs md:text-sm text-slate-400 tracking-wider uppercase">
                  {region?.name || 'Region'}
                </span>
              </div>

              <h2 
                className="text-2xl md:text-4xl text-white mb-3 md:mb-4 font-bold leading-tight"
                style={{ color: region?.glowColor || '#ffffff' }}
              >
                {subdivision.name}
              </h2>

              {subdivision.description && (
                <p className="text-slate-400 text-sm md:text-lg leading-relaxed">
                  {subdivision.description}
                </p>
              )}
            </motion.div>

            {/* Image */}
            {subdivision.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative w-full h-48 sm:h-64 md:h-96 mb-4 md:mb-6 rounded-lg overflow-hidden border border-slate-800"
              >
                <Image
                  src={subdivision.image}
                  alt={subdivision.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 800px"
                />
              </motion.div>
            )}

            {/* Bullets */}
            {subdivision.bullets && subdivision.bullets.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <h3 className="text-xs md:text-sm text-slate-400 tracking-wider uppercase mb-2 md:mb-3">
                  Key Features
                </h3>
                <ul className="space-y-1.5 md:space-y-2">
                  {subdivision.bullets.map((bullet, idx) => (
                    <li
                      key={idx}
                      className="text-slate-300 text-xs md:text-sm flex items-start leading-relaxed"
                    >
                      <span className="mr-2 md:mr-3 mt-0.5 md:mt-1 flex-shrink-0" style={{ color: region?.glowColor || '#ffffff' }}>•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Background Decoration */}
          <div
            className="absolute -bottom-10 -right-10 md:-bottom-20 md:-right-20 w-40 h-40 md:w-80 md:h-80 rounded-full blur-3xl opacity-10"
            style={{ backgroundColor: region?.glowColor || '#ffffff' }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

