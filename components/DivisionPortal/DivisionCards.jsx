'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { regionsData } from '../../data/regions';
import { AiOutlineClose, AiOutlineArrowRight } from 'react-icons/ai';

export default function DivisionCards({ regionId, onDivisionClick, onBack }) {
  const region = regionsData[regionId];
  const [hoveredCard, setHoveredCard] = useState(null);
  
  if (!region) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-40 flex items-center justify-center p-8 pointer-events-auto"
      onClick={onBack}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{
          boxShadow: `0 0 60px ${region.glowColor}20, 0 0 100px ${region.glowColor}10`
        }}
      >
        {/* Accent Border */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(90deg, transparent, ${region.glowColor}, transparent)`
          }}
        />

        {/* Close Button */}
        <button
          onClick={onBack}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700 transition-colors z-10"
        >
          <AiOutlineClose className="w-5 h-5 text-slate-400" />
        </button>

        {/* Content */}
        <div className="p-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 text-center"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: region.glowColor }}
              />
              <span className="text-sm text-slate-400 tracking-wider uppercase">
                {region.name}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl text-white mb-4 font-bold"
              style={{ color: region.glowColor }}
            >
              {region.name}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-slate-400 text-lg"
            >
              {region.description}
            </motion.p>
          </motion.div>
          
          {/* Division Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {region.mainDivisions.map((division, index) => (
              <motion.div
                key={division.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative p-6 rounded-lg bg-slate-800/30 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all duration-300"
                style={{
                  boxShadow: hoveredCard === division.id 
                    ? `0 0 30px ${region.glowColor}30, 0 0 60px ${region.glowColor}10` 
                    : 'none'
                }}
                onMouseEnter={() => setHoveredCard(division.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => onDivisionClick(division)}
              >
                {/* Card Accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg"
                  style={{
                    background: hoveredCard === division.id 
                      ? `linear-gradient(90deg, transparent, ${region.glowColor}, transparent)`
                      : 'transparent'
                  }}
                />

                <h3 className="text-2xl font-semibold mb-3 text-white">
                  {division.name}
                </h3>
                <p className="text-slate-400 mb-4 text-sm">
                  {division.description}
                </p>
                
                {/* Subdivisions Preview */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {division.subdivisions.slice(0, 3).map((sub, idx) => (
                    <motion.span
                      key={idx}
                      whileHover={{ scale: 1.1 }}
                      className="px-3 py-1 text-xs rounded-full border border-slate-700 text-slate-300 bg-slate-800/50"
                    >
                      {sub.name || sub}
                    </motion.span>
                  ))}
                  {division.subdivisions.length > 3 && (
                    <span className="px-3 py-1 text-xs rounded-full border border-slate-700 text-slate-400 bg-slate-800/50">
                      +{division.subdivisions.length - 3} more
                    </span>
                  )}
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 + 0.2 }}
                  className="flex items-center gap-2 text-sm text-slate-400 group"
                >
                  <span>Explore Division</span>
                  <AiOutlineArrowRight 
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    style={{ color: region.glowColor }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Background Decoration */}
        <div
          className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: region.glowColor }}
        />
      </motion.div>
    </motion.div>
  );
}

