"use client";

import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, OrbitControls, Html, Environment } from "@react-three/drei";
import * as THREE from "three";
import * as topojson from "topojson-client";
import { regionsData } from "../../data/regions";
 
// Convert lat/lng to 3D coordinates
const latLngToVector3 = (lat, lng, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
};

 
// Region Hotspot Component with Label
function RegionHotspot({ region, isSelected, isHovered, onClick, onHover }) {
  const position = useMemo(() => {
    return latLngToVector3(region.position.lat, region.position.lng, 2.1);
  }, [region.position.lat, region.position.lng]);

  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      // Pulsing animation
      const scale = isHovered || isSelected ? 1.3 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        // onClick={onClick}
        // onPointerOver={onHover}
        // onPointerOut={() => onHover(false)}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color={region.glowColor}
          emissive={region.glowColor}
          emissiveIntensity={isHovered || isSelected ? 1 : 0.5}
        />
      </mesh>
      {/* Glow effect */}
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
      {/* Region Label - shows on hover */}
      {isHovered && (
        <Html
          position={[0, 0.15, 0]}
          center
          distanceFactor={5}
          style={{
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div
            className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg whitespace-nowrap shadow-lg"
            style={{ padding: "6px 12px" }}
          >
            <p className="text-xs text-white tracking-wide">{region.name}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

// Country Polygon Component - GeoJSON se countries render karta hai
function CountryPolygons({ countries }) {
  const globeRadius = 2; // ✅ Sphere (radius 2) se clearly upar - layers mix na hon

  // GeoJSON coordinates ko 3D sphere coordinates mein convert karna
  const convertGeoJSONTo3D = useCallback(
    (coordinates, isMultiPolygon = false) => {
      const allShapes = [];
      const allBorders = []; // Borders ke liye

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
        // MultiPolygon: har polygon ke saare rings process karo
        coordinates.forEach((polygon) => {
          if (polygon && polygon.length > 0) {
            // Outer ring (first) - fill ke liye
            allShapes.push(processRing(polygon[0]));
            // Borders ke liye bhi add karo
            allBorders.push(processRing(polygon[0]));
          }
        });
      } else {
        // Polygon: first ring is outer boundary
        if (coordinates && coordinates[0]) {
          allShapes.push(processRing(coordinates[0]));
          allBorders.push(processRing(coordinates[0]));
        }
      }

      return { shapes: allShapes, borders: allBorders };
    },
    [globeRadius]
  ); // ✅ Fix: globeRadius dependency add kiya

  // Memoize geometries to prevent recreation on every render
  const countryGeometries = useMemo(() => {
    if (!countries || countries.length === 0)
      return { geometries: [], borders: [] };

    // ✅ Fix: Limit increase kiya (100 se 200) - ya completely remove kar sakte hain
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

      // Fill geometries
      shapes.forEach((points, shapeIdx) => {
        if (!points || points.length < 3) return;

        // Ensure polygon is closed
        const closedPoints = [...points];
        const firstPoint = closedPoints[0];
        const lastPoint = closedPoints[closedPoints.length - 1];
        if (firstPoint.distanceTo(lastPoint) > 0.001) {
          closedPoints.push(firstPoint.clone());
        }

        // Triangulation with proper winding order
        const positions = closedPoints
          .slice(0, -1)
          .flatMap((p) => [p.x, p.y, p.z]);
        const indices = [];

        // Fan triangulation
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

        // Compute normals - use computeVertexNormals for proper lighting
        geometry.computeVertexNormals();

        // Also ensure normals point outward from sphere center
        const positions_array = geometry.attributes.position.array;
        const normals_array = geometry.attributes.normal.array;
        for (let i = 0; i < positions_array.length; i += 3) {
          const x = positions_array[i];
          const y = positions_array[i + 1];
          const z = positions_array[i + 2];
          const length = Math.sqrt(x * x + y * y + z * z);
          if (length > 0) {
            // Normalize and point outward
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

      // Border geometries
      borders.forEach((points, borderIdx) => {
        if (!points || points.length < 2) return;

        // Close the border loop
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
  console.log(
    "Country geometries:",
    countryGeometries.geometries.length,
    "Borders:",
    countryGeometries.borders.length
  );

  return (
    <>
      {/* Base Ocean Sphere - Empty areas (ocean) ko fill karne ke liye */}
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
          depthWrite={false} // ✅ Depth buffer mein write karega
          depthTest={true}
        />
      </Sphere>

      {/* FILLED COUNTRY POLYGONS - Teal-green glowing color - Sphere ke upar render hoga */}
      {countryGeometries.geometries.map(({ geometry, key }) => (
        <mesh
          key={key}
          geometry={geometry}
          renderOrder={1} // Render on top of sphere
        >
          <meshBasicMaterial
            color="#0891b2" // Teal color
            side={THREE.DoubleSide} // Both sides visible
            transparent={true}
            depthWrite={true} // ✅ Depth buffer mein write karega
            depthTest={true} // ✅ Depth testing enable - zaroori hai colors ke liye
          />
        </mesh>
      ))}
      {/* COUNTRY BORDERS - Dark borders */}
      {countryGeometries.borders.map(({ geometry, key }) => (
        <line key={key} geometry={geometry} renderOrder={2}>
          <lineBasicMaterial color="#22d3ee" linewidth={1} />
        </line>
      ))}
    </>
  );
}

// Main Globe Component
function Globe({
  selectedRegion,
  hoveredRegion,
  onRegionClick,
  onRegionHover,
}) {
  const globeRef = useRef();
  const inglobeRef = useRef();
  const [countries, setCountries] = useState([]);

  // TopoJSON data load karna (smaller file size, faster loading)
  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((res) => res.json())
      .then((topojsonData) => {
        // TopoJSON ko GeoJSON mein convert karo
        const geojson = topojson.feature(
          topojsonData,
          topojsonData.objects.countries
        );
        console.log("Loaded TopoJSON, countries:", geojson.features.length);
        setCountries(geojson.features);
      })
      .catch((err) => {
        console.error("Error loading TopoJSON:", err);
      });
  }, []);

  // Auto rotation
  useFrame((state, delta) => {
    if (globeRef.current && !selectedRegion) {
      globeRef.current.rotation.y += delta * 0.05;
    }
  });

  useFrame((state, delta) => {
    if (inglobeRef.current && !selectedRegion) {
      inglobeRef.current.rotation.y -= delta * 0.5;
    }
  });

  return (
    <group ref={globeRef} position={[0, 0, 0]} rotation={[0, -1, 0]}>
      {/* Main Earth Sphere - Dark base with wireframe look */}

      {/* Wireframe overlay for sphere structure - fine mesh */}
      <mesh ref={inglobeRef}>
        <sphereGeometry args={[1.69, 15, 15]} />

        <meshBasicMaterial color="#fff" wireframe />
      </mesh>

      {/* Country Polygons - Teal-green glowing continents */}
      <CountryPolygons countries={countries} />

      {/* Region Hotspots */}
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

// Camera Controller for smooth zoom animation
function CameraController({ selectedRegion, onAnimationComplete }) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 0, 5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isAnimating = useRef(false);

  useEffect(() => {
    if (selectedRegion) {
      const region = regionsData[selectedRegion];
      if (region) {
        // Zoom to region position
        const pos = latLngToVector3(
          region.position.lat,
          region.position.lng,
          3.5
        );
        targetPosition.current = pos;
        targetLookAt.current = latLngToVector3(
          region.position.lat,
          region.position.lng,
          2
        );
        isAnimating.current = true;
        onAnimationComplete?.(true); // Animation started
      }
    } else {
      // Return to default view
      targetPosition.current = new THREE.Vector3(0, 0, 5);
      targetLookAt.current = new THREE.Vector3(0, 0, 0);
      isAnimating.current = true;
      onAnimationComplete?.(true); // Animation started
    }
  }, [selectedRegion, onAnimationComplete]);

  useFrame(() => {
    if (isAnimating.current) {
      const distance = camera.position.distanceTo(targetPosition.current);

      // Smooth camera movement
      camera.position.lerp(targetPosition.current, 0.08);

      // Smooth look at
      const direction = new THREE.Vector3()
        .subVectors(targetLookAt.current, camera.position)
        .normalize();
      const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, -1),
        direction
      );
      camera.quaternion.slerp(targetQuaternion, 0.08);

      // Stop animating when close enough to target
      if (distance < 0.1) {
        isAnimating.current = false;
        // Snap to exact position when close and no region selected
        if (!selectedRegion) {
          camera.position.copy(targetPosition.current);
          camera.lookAt(targetLookAt.current);
        }
        onAnimationComplete?.(false); // Animation completed
      }
    }
  });

  return null;
}
 

 
// Main Interactive Globe Component
export default function InteractiveGlobe({ selectedRegion, onRegionClick }) {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const spotLightRef = useRef();

  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 65 }}
        gl={{ antialias: true }}
      >
        {/* Spot Light - Sun-like effect */}
        <ambientLight intensity={5} color="#7dd3fc" />
       
        <directionalLight intensity={5} position={[5, 10, 5]} castShadow />
        

        <CameraController
          selectedRegion={selectedRegion}
          onAnimationComplete={setIsAnimating}
        />
        <Globe
          selectedRegion={selectedRegion}
          hoveredRegion={hoveredRegion}
          onRegionClick={onRegionClick}
          onRegionHover={setHoveredRegion}
        />

     <OrbitControls
      minDistance={5}
      maxDistance={6}
      autoRotate={!selectedRegion && !isAnimating}
      autoRotateSpeed={0.5}
      enableDamping={true}
      dampingFactor={0.05}
      mouseButtons={{
        LEFT: 0, // Rotate
        MIDDLE: -1, // Disable middle mouse zoom
        RIGHT: 2, // Pan
      }}
      touches={{
        ONE: 0, // Rotate on touch
        TWO: -1, // Disable pinch zoom
      }}
     
     />
      </Canvas>
    </div>
  );
}
