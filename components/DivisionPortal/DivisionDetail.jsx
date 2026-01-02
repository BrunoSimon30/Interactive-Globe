'use client';

import { motion } from 'framer-motion';
import { regionsData } from '../../data/regions';
import { AiOutlineClose, AiOutlineArrowRight } from 'react-icons/ai';
import { HiBuildingOffice2, HiUsers, HiArrowTrendingUp } from 'react-icons/hi2';

export default function DivisionDetail({ division, regionId, onBack }) {
  const region = regionsData[regionId];
  
  if (!division || !region) return null;
  
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
        className="relative w-full max-w-4xl bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
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
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 mb-4"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: region.glowColor }}
              />
              <span className="text-sm text-slate-400 tracking-wider uppercase">
                Division Portal
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl text-white mb-4 font-bold"
              style={{ color: region.glowColor }}
            >
              {division.name}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-slate-400 text-lg"
            >
              {division.description}
            </motion.p>
          </div>

          {/* Subdivisions */}
          {division.subdivisions && division.subdivisions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h3 className="text-sm text-slate-400 tracking-wider uppercase mb-4">
                Subsidiaries & Brands
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {division.subdivisions.map((subdivision, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex flex-col gap-2 p-4 rounded-lg bg-slate-800/30 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: region.glowColor }}
                      />
                      <span className="text-slate-300 font-semibold">
                        {subdivision.name || subdivision}
                      </span>
                    </div>
                    {subdivision.description && (
                      <p className="text-slate-400 text-sm ml-5">
                        {subdivision.description}
                      </p>
                    )}
                    {subdivision.bullets && (
                      <ul className="space-y-1 ml-5">
                        {subdivision.bullets.map((bullet, bulletIdx) => (
                          <li
                            key={bulletIdx}
                            className="text-slate-500 text-xs flex items-start"
                          >
                            <span className="mr-2" style={{ color: region.glowColor }}>•</span>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="p-5 rounded-lg bg-slate-800/30 border border-slate-800">
              <HiBuildingOffice2 className="w-6 h-6 mb-3" style={{ color: region.glowColor }} />
              <p className="text-2xl text-white mb-1 font-semibold">Global</p>
              <p className="text-sm text-slate-400">Operations</p>
            </div>
            
            <div className="p-5 rounded-lg bg-slate-800/30 border border-slate-800">
              <HiUsers className="w-6 h-6 mb-3" style={{ color: region.glowColor }} />
              <p className="text-2xl text-white mb-1 font-semibold">Active</p>
              <p className="text-sm text-slate-400">Worldwide</p>
            </div>
            
            <div className="p-5 rounded-lg bg-slate-800/30 border border-slate-800">
              <HiArrowTrendingUp className="w-6 h-6 mb-3" style={{ color: region.glowColor }} />
              <p className="text-2xl text-white mb-1 font-semibold">Growing</p>
              <p className="text-sm text-slate-400">Continuously</p>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="w-full py-4 rounded-lg flex items-center justify-center gap-2 transition-all group"
            style={{
              backgroundColor: `${region.glowColor}15`,
              border: `1px solid ${region.glowColor}30`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${region.glowColor}25`;
              e.currentTarget.style.borderColor = `${region.glowColor}60`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${region.glowColor}15`;
              e.currentTarget.style.borderColor = `${region.glowColor}30`;
            }}
          >
            <span className="text-white font-semibold">Explore Division Details</span>
            <AiOutlineArrowRight
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              style={{ color: region.glowColor }}
            />
          </motion.button>
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

