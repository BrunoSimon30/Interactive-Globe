"use client";

/**
 * APPROACH 1: Globe Rotation (Current Approach)
 * - Globe object ko rotate karte hain
 * - Camera static rehti hai
 * - Lights fixed (world coordinates)
 * ✅ Best for: Fixed lighting, smooth performance
 */

import { useState } from "react";
import dynamic from "next/dynamic";

const InteractiveGlobe = dynamic(
  () => import("../components/Globe/InteractiveGlobe"),
  { ssr: false }
);

export default function GlobeApproach1() {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const handleRegionClick = (regionId) => {
    setSelectedRegion(regionId);
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
        <h1 className="text-xl font-bold text-white mb-2">Approach 1: Globe Rotation</h1>
        <p className="text-sm text-slate-300">
          Globe object rotate hota hai, camera static. Lights fixed rahenge.
        </p>
      </div>
      <InteractiveGlobe
        selectedRegion={selectedRegion}
        onRegionClick={handleRegionClick}
      />
    </div>
  );
}

