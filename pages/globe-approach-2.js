"use client";

/**
 * APPROACH 2: OrbitControls
 * - Built-in drei OrbitControls use karte hain
 * - Camera rotate hoti hai
 * - Globe static rehta hai
 * ⚠️ Lights ka angle change hoga (camera rotate hone se)
 */

import { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import * as topojson from "topojson-client";
import { regionsData } from "../data/regions";

// Convert lat/lng to 3D coordinates
const latLngToVector3 = (lat, lng, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
};

// Region Hotspot Component
function RegionHotspot({ region, isSelected, isHovered, onClick, onHover }) {
  const position = useMemo(() => {
    return latLngToVector3(region.position.lat, region.position.lng, 2.1);
  }, [region.position.lat, region.position.lng]);

  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      const scale = isHovered || isSelected ? 1.3 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={onHover}
        onPointerOut={() => onHover(false)}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color={region.glowColor}
          emissive={region.glowColor}
          emissiveIntensity={isHovered || isSelected ? 1 : 0.5}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={region.glowColor}
          emissive={region.glowColor}
          emissiveIntensity={isHovered || isSelected ? 0.3 : 0.1}
          transparent
          opacity={0.5}
        />
      </mesh>
      {isHovered && (
        <Html position={[0, 0.15, 0]} center distanceFactor={5} style={{ pointerEvents: "none", userSelect: "none" }}>
          <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg whitespace-nowrap shadow-lg" style={{ padding: "6px 12px" }}>
            <p className="text-xs text-white tracking-wide">{region.name}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

// Country Polygons Component (simplified for demo)
function CountryPolygons({ countries }) {
  const globeRadius = 2;

  // Simplified country rendering - same as original
  // Full implementation would be same as InteractiveGlobe.jsx
  
  return (
    <>
      <Sphere args={[2, 90, 90]} renderOrder={0}>
        <meshPhysicalMaterial
          color="#00d4ff"
          metalness={0.9}
          roughness={0.3}
          opacity={0.9}
          transparent={true}
          depthWrite={false}
        />
      </Sphere>
    </>
  );
}

// Globe Component - Static (OrbitControls handle rotation)
function Globe({ selectedRegion, hoveredRegion, onRegionClick, onRegionHover }) {
  const [countries, setCountries] = useState([]);
  const inglobeRef = useRef();

  useEffect(() => {
    let isMounted = true;
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((res) => res.json())
      .then((topojsonData) => {
        if (!isMounted) return;
        const geojson = topojson.feature(topojsonData, topojsonData.objects.countries);
        setCountries(geojson.features);
      })
      .catch((err) => console.error("Error loading TopoJSON:", err));

    return () => { isMounted = false; };
  }, []);

  // Wireframe rotation (independent)
  useFrame((state, delta) => {
    if (inglobeRef.current && !selectedRegion) {
      inglobeRef.current.rotation.y -= delta * 0.5;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={inglobeRef}>
        <sphereGeometry args={[1.69, 15, 15]} />
        <meshBasicMaterial color="#fff" wireframe />
      </mesh>
      <CountryPolygons countries={countries} />
      {Object.values(regionsData).map((region) => (
        <RegionHotspot
          key={region.id}
          region={region}
          isSelected={selectedRegion === region.id}
          isHovered={hoveredRegion === region.id}
          onClick={() => onRegionClick(region.id)}
          onHover={(isHovering) => onRegionHover(isHovering ? region.id : null)}
        />
      ))}
    </group>
  );
}

export default function GlobeApproach2() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const controlsRef = useRef();

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg p-4 z-10">
        <h1 className="text-xl font-bold text-white mb-2">Approach 2: OrbitControls</h1>
        <p className="text-sm text-slate-300">
          Camera rotate hoti hai via OrbitControls. ⚠️ Lights ka angle change hoga.
        </p>
      </div>
      <Canvas camera={{ position: [0, 0, 5], fov: 65 }} gl={{ antialias: true }}>
        <ambientLight intensity={5} color="#7dd3fc" />
        <directionalLight intensity={5} position={[5, 10, 5]} castShadow />
        
        <OrbitControls
          ref={controlsRef}
          enableRotate={!selectedRegion}
          enableZoom={true}
          enablePan={false}
          autoRotate={!selectedRegion && !isAnimating}
          autoRotateSpeed={0.5}
          minDistance={3}
          maxDistance={10}
          target={[0, 0, 0]}
        />

        <Globe
          selectedRegion={selectedRegion}
          hoveredRegion={hoveredRegion}
          onRegionClick={setSelectedRegion}
          onRegionHover={setHoveredRegion}
        />
      </Canvas>
    </div>
  );
}

