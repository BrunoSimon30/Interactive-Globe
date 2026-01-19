import { useState } from "react";

import dynamic from "next/dynamic";
import DivisionDetail from "../components/DivisionPortal/DivisionDetail";
import Caption from "../components/UI/Caption";
import SubdivisionModal from "../components/UI/SubdivisionModal";


import { regionsData } from "../data/regions";
import Head from "next/head";
import Header from "@/components/Header";

// Dynamically import Globe to avoid SSR issues
const InteractiveGlobe = dynamic(
  () => import("../components/Globe/InteractiveGlobe"),
  { ssr: false }
);

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedSubdivision, setSelectedSubdivision] = useState(null);

  const handleRegionClick = (regionId) => {
    setSelectedRegion(regionId);
    setSelectedDivision(null);
    setSelectedSubdivision(null);
  };

  const handleSubdivisionClick = (subdivision) => {
    setSelectedSubdivision(subdivision);
  };

  const handleBack = () => {
    if (selectedSubdivision) {
      setSelectedSubdivision(null);
    } else if (selectedDivision) {
      setSelectedDivision(null);
    } else if (selectedRegion) {
      setSelectedRegion(null);
    }
  };

  // Back to region handler - Modal close + Region deselect
  const handleBackToRegion = () => {
    setSelectedSubdivision(null); // Close modal
    setSelectedRegion(null); // Deselect region (globe zoom out)
  };

  const currentRegion = selectedRegion ? regionsData[selectedRegion] : null;

  return (
    <>
      <Head>
        <title>SJEG Globe | Interactive Globe</title>
      </Head>
      <Header/>
      <section>
     
        <div
          className={`  relative w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden`}
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,217,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />

          {/* Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-3xl" />

          {/* Globe Background */}
          <div className="absolute inset-0">
            <InteractiveGlobe
              selectedRegion={selectedRegion}
              selectedSubdivision={selectedSubdivision} // Pass subdivision state
              onRegionClick={handleRegionClick}
              onSubdivisionClick={handleSubdivisionClick}
            />
          </div>

          {/* Caption or Back Button - single component handles both */}
          <Caption
            show={!selectedRegion && !selectedDivision && !selectedSubdivision}
            selectedRegion={selectedRegion && !selectedSubdivision ? selectedRegion : null}
            onBackToRegion={selectedRegion && !selectedSubdivision ? handleBackToRegion : null}
            regionGlowColor={currentRegion?.glowColor}
          />
          {/* Note: Division Cards removed - subdivisions now show directly on globe */}

          {/* Division Detail - show when division selected (if needed) */}
          {selectedDivision && selectedRegion && !selectedSubdivision && (
            <DivisionDetail
              division={selectedDivision}
              regionId={selectedRegion}
              onBack={handleBack}
            />
          )}

          {/* Subdivision Modal - show when subdivision clicked */}
          <SubdivisionModal
            subdivision={selectedSubdivision}
            region={currentRegion}
            isOpen={!!selectedSubdivision}
            onClose={() => setSelectedSubdivision(null)} // Just close modal
            onBackToRegion={handleBackToRegion} // Back to region (deselect)
          />
        </div>
      </section>
    </>
  );
}
