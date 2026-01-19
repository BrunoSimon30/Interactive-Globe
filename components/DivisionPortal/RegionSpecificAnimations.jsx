'use client';

import { motion } from 'framer-motion';
import { 
  HiSun, 
  HiHome, 
  HiBuildingOffice2,
  HiTruck,
  HiGlobeAlt,
  HiHeart
} from 'react-icons/hi2';
import { HiLightningBolt } from 'react-icons/hi';

export default function RegionSpecificAnimations({ regionId, glowColor }) {
  // Africa - Solar/Wind Energy Icons
  if (regionId === 'africa') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Solar panels animation */}
        <motion.div
          className="absolute top-10 right-10"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <HiSun className="w-12 h-12" style={{ color: glowColor, opacity: 0.6 }} />
        </motion.div>
        
        {/* Wind energy animation */}
        <motion.div
          className="absolute bottom-20 left-10"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <HiLightningBolt className="w-10 h-10" style={{ color: glowColor, opacity: 0.5 }} />
        </motion.div>

        {/* Floating energy particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: glowColor }}
            />
          </motion.div>
        ))}
      </div>
    );
  }

  // Europe - Blueprint/Architecture Icons
  if (regionId === 'europe') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Blueprint grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(${glowColor} 1px, transparent 1px),
              linear-gradient(90deg, ${glowColor} 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Building icons */}
        <motion.div
          className="absolute top-16 left-16"
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        >
          <HiBuildingOffice2 className="w-16 h-16" style={{ color: glowColor, opacity: 0.4 }} />
        </motion.div>

        <motion.div
          className="absolute bottom-24 right-20"
          animate={{
            y: [0, -8, 0],
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: 0.5,
          }}
        >
          <HiHome className="w-14 h-14" style={{ color: glowColor, opacity: 0.35 }} />
        </motion.div>

        {/* Architectural lines */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${15 + i * 25}%`,
              top: `${20 + (i % 2) * 60}%`,
              width: '2px',
              height: '60px',
              backgroundColor: glowColor,
              opacity: 0.2,
            }}
            animate={{
              height: [40, 80, 40],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 2 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    );
  }

  // Asia - Trade Routes/Shipping Icons
  if (regionId === 'asia') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Shipping truck animation */}
        <motion.div
          className="absolute bottom-32 left-10"
          animate={{
            x: [-50, 200, -50],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <HiTruck className="w-12 h-12" style={{ color: glowColor, opacity: 0.6 }} />
        </motion.div>

        {/* Globe icon */}
        <motion.div
          className="absolute top-20 right-16"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <HiGlobeAlt className="w-14 h-14" style={{ color: glowColor, opacity: 0.5 }} />
        </motion.div>

        {/* Trade route lines */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 20}%`,
              top: `${25 + (i % 3) * 25}%`,
              width: '100px',
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
              opacity: 0.3,
            }}
            animate={{
              x: [0, 50, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}

        {/* Export particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${15 + (i % 4) * 25}%`,
              top: `${30 + Math.floor(i / 4) * 40}%`,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: glowColor }}
            />
          </motion.div>
        ))}
      </div>
    );
  }

  // Oceania - Humanitarian Icons Halo
  if (regionId === 'oceania') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        {/* Halo of humanitarian icons */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 120;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.8, 0.4],
                rotate: [0, 360],
              }}
              transition={{
                duration: 4 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              <HiHeart className="w-8 h-8" style={{ color: glowColor }} />
            </motion.div>
          );
        })}

        {/* Central glow */}
        <motion.div
          className="absolute"
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: glowColor,
            opacity: 0.1,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />
      </div>
    );
  }

  // Default (Caribbean) - Tech/AI particles
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Tech particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${10 + (i % 4) * 30}%`,
            top: `${20 + Math.floor(i / 4) * 25}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(i) * 20, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3 + i * 0.2,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: glowColor }}
          />
        </motion.div>
      ))}
    </div>
  );
}

