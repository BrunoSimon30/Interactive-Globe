import { useState } from "react";

import dynamic from "next/dynamic";
import DivisionCards from "../components/DivisionPortal/DivisionCards";
import DivisionDetail from "../components/DivisionPortal/DivisionDetail";
import Image from "next/image";
import { BsGlobeAmericas } from "react-icons/bs";
import Head from "next/head";

// Dynamically import Globe to avoid SSR issues
const InteractiveGlobe = dynamic(
  () => import("../components/Globe/InteractiveGlobe"),
  { ssr: false }
);

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);

  const handleRegionClick = (regionId) => {
    setSelectedRegion(regionId);
    setSelectedDivision(null);
  };

  const handleDivisionClick = (division) => {
    setSelectedDivision(division);
  };

  const handleBack = () => {
    if (selectedDivision) {
      setSelectedDivision(null);
    } else if (selectedRegion) {
      setSelectedRegion(null);
    }
  };

  return (
    <>
      <Head>
        <title>SJEG Globe | Interactive Globe</title>
      </Head>
      <section>
        <header className="fixed top-0 left-0 w-full z-50  flex justify-between items-center px-8 py-4 ">
          <div>
            <Image src="/img/logo.png" alt="logo" width={120} height={120} />
          </div>
          <div className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[#2c3144]">
            <BsGlobeAmericas className="text-2xl text-[#d2b6ec]" />
          </div>
        </header>
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
              onRegionClick={handleRegionClick}
            />
          </div>

          {/* Caption - only show when no region selected */}
          {/* <Caption show={!selectedRegion && !selectedDivision} /> */}

          {/* Division Cards - show when region selected but no division */}
          {selectedRegion && !selectedDivision && (
            <DivisionCards
              regionId={selectedRegion}
              onDivisionClick={handleDivisionClick}
              onBack={handleBack}
            />
          )}

          {/* Division Detail - show when division selected */}
          {selectedDivision && selectedRegion && (
            <DivisionDetail
              division={selectedDivision}
              regionId={selectedRegion}
              onBack={handleBack}
            />
          )}
        </div>
        {/* <footer className="fixed bottom-0 left-0 w-full z-50  pb-4 px-8">
        <div className="text-right">
          <div className="flex items-center gap-4 justify-end">
            <Link href="/" className="text-2xl text-[#d2b6ec]"><FaInstagram /></Link>
            <Link href="/" className="text-2xl text-[#d2b6ec]"><AiOutlineFacebook /></Link>
            
          </div>
        </div>
      </footer> */}
      </section>
    </>
  );
}
