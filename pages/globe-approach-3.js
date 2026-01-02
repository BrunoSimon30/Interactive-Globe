"use client";

/**
 * APPROACH 3: Parent Group Wrapper
 * - Drag handlers parent component mein hain
 * - Group wrapper Globe ko wrap karta hai
 * - Globe component static rendering karta hai
 * - Better separation of concerns
 * ✅ Lights fixed (camera static)
 */

import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, Html } from "@react-three/drei";
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

// Country Polygon Component - Full implementation
function CountryPolygons({ countries }) {
  const globeRadius = 2;

  const convertGeoJSONTo3D = useCallback(
    (coordinates, isMultiPolygon = false) => {
      const allShapes = [];
      const allBorders = [];

      const processRing = (ring) => {
        const points = [];
        ring.forEach((coord) => {
          const [lng, lat] = coord;
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lng + 180) * (Math.PI / 180);
          const x = -globeRadius * Math.sin(phi) * Math.cos(theta);
          const y = globeRadius * Math.cos(phi);
          const z = globeRadius * Math.sin(phi) * Math.sin(theta);
          points.push(new THREE.Vector3(x, y, z));
        });
        return points;
      };

      if (isMultiPolygon) {
        coordinates.forEach((polygon) => {
          if (polygon && polygon.length > 0) {
            allShapes.push(processRing(polygon[0]));
            allBorders.push(processRing(polygon[0]));
          }
        });
      } else {
        if (coordinates && coordinates[0]) {
          allShapes.push(processRing(coordinates[0]));
          allBorders.push(processRing(coordinates[0]));
        }
      }

      return { shapes: allShapes, borders: allBorders };
    },
    [globeRadius]
  );

  const countryGeometries = useMemo(() => {
    if (!countries || countries.length === 0)
      return { geometries: [], borders: [] };

    const limitedCountries = countries.slice(0, 200);
    const geometries = [];
    const borderGeometries = [];

    limitedCountries.forEach((country, idx) => {
      if (!country.geometry || !country.geometry.coordinates) return;

      const isMultiPolygon = country.geometry.type === "MultiPolygon";
      const { shapes, borders } = convertGeoJSONTo3D(
        country.geometry.coordinates,
        isMultiPolygon
      );

      shapes.forEach((points, shapeIdx) => {
        if (!points || points.length < 3) return;

        const closedPoints = [...points];
        const firstPoint = closedPoints[0];
        const lastPoint = closedPoints[closedPoints.length - 1];
        if (firstPoint.distanceTo(lastPoint) > 0.001) {
          closedPoints.push(firstPoint.clone());
        }

        const positions = closedPoints
          .slice(0, -1)
          .flatMap((p) => [p.x, p.y, p.z]);
        const indices = [];

        const numPoints = closedPoints.length - 1;
        for (let i = 1; i < numPoints - 1; i++) {
          indices.push(0, i, i + 1);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(positions, 3)
        );
        if (indices.length > 0) {
          geometry.setIndex(indices);
        }

        geometry.computeVertexNormals();

        const positions_array = geometry.attributes.position.array;
        const normals_array = geometry.attributes.normal.array;
        for (let i = 0; i < positions_array.length; i += 3) {
          const x = positions_array[i];
          const y = positions_array[i + 1];
          const z = positions_array[i + 2];
          const length = Math.sqrt(x * x + y * y + z * z);
          if (length > 0) {
            normals_array[i] = x / length;
            normals_array[i + 1] = y / length;
            normals_array[i + 2] = z / length;
          }
        }

        geometries.push({
          geometry,
          key: `country-${idx}-${shapeIdx}`,
        });
      });

      borders.forEach((points, borderIdx) => {
        if (!points || points.length < 2) return;

        const borderPoints = [...points];
        if (borderPoints.length > 0) {
          borderPoints.push(borderPoints[0]);
        }

        const borderGeometry = new THREE.BufferGeometry().setFromPoints(
          borderPoints.map((p) => new THREE.Vector3(p.x, p.y, p.z))
        );

        borderGeometries.push({
          geometry: borderGeometry,
          key: `border-${idx}-${borderIdx}`,
        });
      });
    });

    return { geometries, borders: borderGeometries };
  }, [countries, convertGeoJSONTo3D]);

  if (countryGeometries.geometries.length === 0) return null;

  return (
    <>
      <Sphere args={[2, 90, 90]} renderOrder={0}>
        <meshPhysicalMaterial
          color="#00d4ff"
          metalness={0.9}
          roughness={0.3}
          ior={1.5}
          iridescenceIOR={1.3}
          specularIntensity={2}
          opacity={0.9}
          transparent={true}
          depthWrite={false}
          depthTest={true}
        />
      </Sphere>

      {countryGeometries.geometries.map(({ geometry, key }) => (
        <mesh key={key} geometry={geometry} renderOrder={1}>
          <meshBasicMaterial
            color="#0891b2"
            side={THREE.DoubleSide}
            transparent={true}
            depthWrite={true}
            depthTest={true}
          />
        </mesh>
      ))}
      {countryGeometries.borders.map(({ geometry, key }) => (
        <line key={key} geometry={geometry} renderOrder={2}>
          <lineBasicMaterial color="#22d3ee" linewidth={1} />
        </line>
      ))}
    </>
  );
}

// Globe Component - Static (no rotation logic, parent handles it)
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

// Rotation Controller Component - Canvas ke andar useFrame handle karta hai
function RotationController({ globeGroupRef, selectedRegion, targetRotationX, targetRotationY, mouseDown, slowingFactor }) {
  useFrame((state, delta) => {
    if (!globeGroupRef.current || selectedRegion) return;
    
    if (Math.abs(targetRotationX.current) > 0.0001 || Math.abs(targetRotationY.current) > 0.0001) {
      globeGroupRef.current.rotation.y += targetRotationX.current;
      globeGroupRef.current.rotation.x += targetRotationY.current;
      targetRotationX.current *= slowingFactor;
      targetRotationY.current *= slowingFactor;
    }
    
    if (!mouseDown.current && Math.abs(targetRotationX.current) < 0.001) {
      globeGroupRef.current.rotation.y += delta * 0.05;
    }
  });

  return null;
}

// Main Component with Parent Group Wrapper
export default function GlobeApproach3() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // ✅ Drag state in PARENT component
  const globeGroupRef = useRef();
  const targetRotationX = useRef(0);
  const targetRotationY = useRef(0);
  const mouseDown = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);
  const currentMouseX = useRef(0);
  const currentMouseY = useRef(0);

  const dragFactor = 0.003;
  const slowingFactor = 0.92;

  // ✅ Global mouse position tracker
  useEffect(() => {
    const trackMouse = (e) => {
      currentMouseX.current = e.clientX;
      currentMouseY.current = e.clientY;
    };
    document.addEventListener('mousemove', trackMouse, { passive: true });
    return () => document.removeEventListener('mousemove', trackMouse);
  }, []);

  // ✅ Document-level pointer handlers in PARENT
  useEffect(() => {
    if (selectedRegion) return;

    const handlePointerMove = (e) => {
      if (!mouseDown.current) return;
      const deltaX = e.clientX - lastMouseX.current;
      const deltaY = e.clientY - lastMouseY.current;
      targetRotationX.current = deltaX * dragFactor;
      targetRotationY.current = deltaY * dragFactor;
      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;
    };

    const handlePointerUp = (e) => {
      if (mouseDown.current) {
        mouseDown.current = false;
        e.stopPropagation();
      }
    };

    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerup', handlePointerUp);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [selectedRegion, dragFactor]);

  // ✅ Pointer down handler for parent group
  const handlePointerDown = (e) => {
    e.stopPropagation();
    if (selectedRegion) return;
    mouseDown.current = true;
    lastMouseX.current = currentMouseX.current;
    lastMouseY.current = currentMouseY.current;
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg p-4 z-10">
        <h1 className="text-xl font-bold text-white mb-2">Approach 3: Parent Group Wrapper</h1>
        <p className="text-sm text-slate-300">
          Drag handlers parent mein hain. Globe component static. ✅ Lights fixed.
        </p>
      </div>
      <Canvas camera={{ position: [0, 0, 5], fov: 65 }} gl={{ antialias: true }}>
        <ambientLight intensity={5} color="#7dd3fc" />
        <directionalLight intensity={5} position={[5, 10, 5]} castShadow />
        
        {/* ✅ Rotation Controller - Canvas ke andar */}
        <RotationController
          globeGroupRef={globeGroupRef}
          selectedRegion={selectedRegion}
          targetRotationX={targetRotationX}
          targetRotationY={targetRotationY}
          mouseDown={mouseDown}
          slowingFactor={slowingFactor}
        />
        
        {/* ✅ Parent Group Wrapper with drag handlers */}
        <group
          ref={globeGroupRef}
          position={[0, 0, 0]}
          rotation={[0, -1, 0]}
          onPointerDown={handlePointerDown}
        >
          <Globe
            selectedRegion={selectedRegion}
            hoveredRegion={hoveredRegion}
            onRegionClick={setSelectedRegion}
            onRegionHover={setHoveredRegion}
          />
        </group>
      </Canvas>
    </div>
  );
}

