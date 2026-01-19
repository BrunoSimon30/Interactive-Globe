"use client";

import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, OrbitControls, Html, Environment } from "@react-three/drei";
import * as THREE from "three";
import * as topojson from "topojson-client";
import { regionsData } from "../../data/regions";

/**
 * Convert Latitude/Longitude to 3D Coordinates
 * Ye function lat/lng ko 3D space mein convert karta hai
 * 
 * @param {number} lat - Latitude (-90 to 90)
 * @param {number} lng - Longitude (-180 to 180)
 * @param {number} radius - Distance from globe center (zoom level)
 * @returns {THREE.Vector3} - 3D position on sphere
 * 
 * Example: latLngToVector3(0, 20, 4.5) → Africa ke around camera position
 */
const latLngToVector3 = (lat, lng, radius) => {
  // Convert latitude to spherical coordinates (phi angle)
  // 90 - lat kyunki: North pole = 0°, Equator = 90°
  const phi = (90 - lat) * (Math.PI / 180);
  
  // Convert longitude to spherical coordinates (theta angle)
  // +180 kyunki: -180° to 180° ko 0° to 360° mein convert karna
  const theta = (lng + 180) * (Math.PI / 180);

  // Calculate 3D coordinates using spherical to cartesian conversion
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
};

/**
 * Region Hotspot Component
 * Ye component har region (Africa, Asia, etc.) ke liye clickable hotspot banata hai
 * 
 * Props:
 * - region: Region data (name, position, glowColor)
 * - isSelected: Kya ye region currently selected hai
 * - isHovered: Mouse hover par hai ya nahi
 * - onClick: Click handler function
 * - onHover: Hover handler function
 */
function RegionHotspot({ region, isSelected, isHovered, onClick, onHover }) {
  // Region ki position calculate karo (globe surface par, radius 2.1)
  // useMemo use kiya taaki position sirf tab recalculate ho jab lat/lng change ho
  const position = useMemo(() => {
    return latLngToVector3(region.position.lat, region.position.lng, 2.1);
  }, [region.position.lat, region.position.lng]);

  // Mesh reference for animation
  const meshRef = useRef();

  // Har frame animation update karo
  useFrame(() => {
    if (meshRef.current) {
      // Hover ya selected par scale badhao (pulsing effect)
      const scale = isHovered || isSelected ? 1.3 : 1;
      // Smooth scale transition using lerp (linear interpolation)
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <group position={position}>
      {/* Main Hotspot Sphere - Clickable region marker */}
      <mesh
        ref={meshRef}
        onClick={onClick}              // Click par region select karo
        onPointerOver={onHover}        // Mouse hover par
        onPointerOut={() => onHover(false)}  // Mouse leave par
      >
        {/* Small sphere (radius 0.05) - main hotspot */}
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color={region.glowColor}      // Region ka color (e.g., Africa = green)
          emissive={region.glowColor}   // Glow effect ke liye
          emissiveIntensity={isHovered || isSelected ? 1 : 0.5}  // Hover par zyada glow
        />
      </mesh>
      
      {/* Outer Glow Ring - Visual effect ke liye */}
      <mesh>
        {/* Larger sphere (radius 0.08) - glow effect */}
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={region.glowColor}
          emissive={region.glowColor}
          emissiveIntensity={isHovered || isSelected ? 0.3 : 0.1}
          transparent
          opacity={0.5}  // Semi-transparent glow
        />
      </mesh>
      
      {/* Region Label - Hover par show hota hai */}
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

/**
 * Subdivision Hotspot Component
 * Ye component subdivisions (Micro-grids, Clean-tech Labs, etc.) ke liye hotspots banata hai
 * Jab region select hota hai, to ye subdivisions globe par show hote hain
 * 
 * Props:
 * - subdivision: Subdivision data (name, position, description)
 * - region: Parent region data (glowColor ke liye)
 * - isHovered: Mouse hover state
 * - onClick: Click handler (modal open karta hai)
 * - onHover: Hover handler
 */
function SubdivisionHotspot({ subdivision, region, isHovered, onClick, onHover }) {
  // Subdivision ki position calculate karo
  // Agar position nahi hai, to null return karo
  const position = useMemo(() => {
    if (!subdivision.position) return null;
    return latLngToVector3(subdivision.position.lat, subdivision.position.lng, 2.1);
  }, [subdivision.position]);

  const meshRef = useRef();

  // Smooth scale animation on hover
  useFrame(() => {
    if (meshRef.current) {
      const scale = isHovered ? 1.4 : 1.1;  // Hover par zyada scale
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  // Agar position nahi hai, to kuch render mat karo
  if (!position) return null;

  return (
    <group position={position}>
      {/* Main hotspot - larger and more visible */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={onHover}
        onPointerOut={() => onHover(false)}
      >
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial
          color={region.glowColor}
          emissive={region.glowColor}
          emissiveIntensity={isHovered ? 1.2 : 0.8}
        />
      </mesh>
      {/* Glow effect */}
      <mesh onClick={onClick}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={region.glowColor}
          emissive={region.glowColor}
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>
      {/* Subdivision Label - Region select hone par hamesha visible */}
      {/* Html component se 3D space mein HTML render karte hain */}
      <Html
        position={[0, 0.12, 0]}  // Hotspot ke upar 0.12 units
        center                   // Label center align
        distanceFactor={5}       // Distance se size adjust
        style={{
          pointerEvents: "none",  // Click events ignore
          userSelect: "none",     // Text select disable
        }}
      >
        <div
          className="bg-slate-900/90 backdrop-blur-sm border rounded-lg whitespace-nowrap shadow-lg"
          style={{ 
            padding: "4px 6px",
            borderColor: region.glowColor + '60',
            borderWidth: '1px'
          }}
        >
          <p className="text-[10px] font-medium tracking-wide " style={{ color: region.glowColor }}>
            {subdivision.name}
          </p>
        </div>
      </Html>
    </group>
  );
}

// Main Globe Component
function Globe({
  selectedRegion,
  selectedSubdivision,  // NEW: To hide subdivisions when modal open
  hoveredRegion,
  hoveredSubdivision,
  onRegionClick,
  onRegionHover,
  onSubdivisionClick,
  onSubdivisionHover,
  useCustomControls = true, // ✅ Desktop par custom controls, mobile par nahi
}) {
  const globeRef = useRef();
  const inglobeRef = useRef();
  const [countries, setCountries] = useState([]);
  
  // ✅ Drag state using refs (to avoid infinite re-renders)
  const targetRotationX = useRef(0);
  const targetRotationY = useRef(0);
  const mouseDown = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);
  const currentMouseX = useRef(0); // Global mouse position tracker
  const currentMouseY = useRef(0);

  const dragFactor = 0.003; // ✅ Reduced for smoother movement
  const slowingFactor = 0.92; // ✅ Adjusted for better inertia

  // ✅ Global mouse position tracker
  useEffect(() => {
    const trackMouse = (e) => {
      currentMouseX.current = e.clientX;
      currentMouseY.current = e.clientY;
    };
    document.addEventListener('mousemove', trackMouse, { passive: true });
    return () => document.removeEventListener('mousemove', trackMouse);
  }, []);

  // ✅ Document-level pointer move/up handlers for smooth dragging (sirf desktop par)
  useEffect(() => {
    if (!useCustomControls) return; // ✅ Custom controls sirf desktop par

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
        e.stopPropagation(); // Prevent multiple fires
      }
    };

    // Add listeners to document for move/up (to handle dragging outside globe)
    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerup', handlePointerUp);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragFactor, useCustomControls]);

  // ✅ Local handler for pointer down on globe (sirf desktop par)
  const handlePointerDown = (e) => {
    if (!useCustomControls) return; // ✅ Custom controls sirf desktop par
    e.stopPropagation();
    mouseDown.current = true;
    // Use tracked global mouse position
    lastMouseX.current = currentMouseX.current;
    lastMouseY.current = currentMouseY.current;
  };

  // TopoJSON data load karna (smaller file size, faster loading)
  const hasLoadedRef = useRef(false);
  
  useEffect(() => {
    // ✅ Prevent multiple fetches
    if (hasLoadedRef.current || countries.length > 0) return;
    
    hasLoadedRef.current = true;
    let isMounted = true;
    
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((res) => res.json())
      .then((topojsonData) => {
        if (!isMounted) return;
        // TopoJSON ko GeoJSON mein convert karo
        const geojson = topojson.feature(
          topojsonData,
          topojsonData.objects.countries
        );
        setCountries(geojson.features);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error loading TopoJSON:", err);
        hasLoadedRef.current = false; // Retry on error
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // ✅ Auto rotation with drag support - optimized (sirf desktop par)
  useFrame((state, delta) => {
    if (!globeRef.current || !useCustomControls) return; // ✅ Custom controls sirf desktop par
    
    // Drag rotation (always enabled, even when region is selected)
    if (Math.abs(targetRotationX.current) > 0.0001 || Math.abs(targetRotationY.current) > 0.0001) {
      globeRef.current.rotation.y += targetRotationX.current;
      globeRef.current.rotation.x += targetRotationY.current;
      
      // Inertia effect
      targetRotationX.current *= slowingFactor;
      targetRotationY.current *= slowingFactor;
      
    }
    
    // Auto rotation (jab drag nahi ho raha aur region select nahi hai)
    if (!mouseDown.current && Math.abs(targetRotationX.current) < 0.001 && !selectedRegion) {
      globeRef.current.rotation.y += delta * 0.05;
    }
  });

  useFrame((state, delta) => {
    if (inglobeRef.current && !selectedRegion) {
      inglobeRef.current.rotation.y -= delta * 0.5;
    }
  });

  return (
    <group 
      ref={globeRef} 
      position={[0, 0, 0]} 
      rotation={[0, -1, 0]}
      onPointerDown={handlePointerDown}
    >
      {/* Wireframe overlay for sphere structure - fine mesh */}
      <mesh ref={inglobeRef}>
        <sphereGeometry args={[1.69, 15, 15]} />
        <meshBasicMaterial color="#fff" wireframe />
      </mesh>

      {/* Country Polygons - Teal-green glowing continents */}
      <CountryPolygons countries={countries} />

      {/* Region Hotspots */}
      {!selectedRegion && Object.values(regionsData).map((region) => (
        <RegionHotspot
          key={region.id}
          region={region}
          isSelected={false}
          isHovered={hoveredRegion === region.id}
          onClick={() => onRegionClick(region.id)}
          onHover={(isHovering) => onRegionHover(isHovering ? region.id : null)}
        />
      ))}

      {/* Subdivision Hotspots - Jab region select ho tab show, but modal open par hide */}
      {selectedRegion && !selectedSubdivision && (() => {
        const region = regionsData[selectedRegion];
        if (!region) return null;
        
        /**
         * Sab subdivisions collect karo
         * Har region ke andar multiple divisions hote hain
         * Har division ke andar multiple subdivisions hote hain
         * Sirf un subdivisions ko show karo jinke paas position hai
         */
        const allSubdivisions = [];
        region.mainDivisions.forEach(division => {
          if (division.subdivisions) {
            division.subdivisions.forEach(sub => {
              // Sirf wo subdivisions add karo jinke paas position data hai
              if (sub.position) {
                allSubdivisions.push({ ...sub, divisionId: division.id });
              }
            });
          }
        });

        // Sab subdivisions ko render karo
        return allSubdivisions.map((subdivision) => (
          <SubdivisionHotspot
            key={subdivision.id}
            subdivision={subdivision}
            region={region}
            isHovered={hoveredSubdivision === subdivision.id}
            onClick={() => onSubdivisionClick(subdivision)}
            onHover={(isHovering) => onSubdivisionHover(isHovering ? subdivision.id : null)}
          />
        ));
      })()}
    </group>
  );
}

// Main Interactive Globe Component
export default function InteractiveGlobe({ 
  selectedRegion,
  selectedSubdivision,  // NEW: Subdivision state to hide hotspots when modal open
  onRegionClick,
  onSubdivisionClick,
}) {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [hoveredSubdivision, setHoveredSubdivision] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ 
          position: [0, 0, isMobile ? 6 : 5], 
          fov: isMobile ? 75 : 65 
        }}
        gl={{ 
          antialias: !isMobile, // Disable antialiasing on mobile for better performance
          powerPreference: "high-performance"
        }}
      >
        {/* Spot Light - Sun-like effect */}
        <ambientLight intensity={5} color="#7dd3fc" />
       
        <directionalLight intensity={5} position={[5, 10, 5]} castShadow />
        
        {/* ✅ OrbitControls - sirf mobile par (built-in touch support) */}
        {isMobile && (
          <OrbitControls
            enableRotate={true}
            enableZoom={true}
            enablePan={false}
            autoRotate={!selectedRegion}
            autoRotateSpeed={0.5}
            minDistance={3}
            maxDistance={10}
            target={[0, 0, 0]}
            enableDamping={true}
            dampingFactor={0.05}
          />
        )}

        <Globe
          selectedRegion={selectedRegion}
          selectedSubdivision={selectedSubdivision}
          hoveredRegion={hoveredRegion}
          hoveredSubdivision={hoveredSubdivision}
          onRegionClick={onRegionClick}
          onRegionHover={setHoveredRegion}
          onSubdivisionClick={onSubdivisionClick}
          onSubdivisionHover={setHoveredSubdivision}
          useCustomControls={!isMobile} // ✅ Desktop par custom controls, mobile par OrbitControls
        />

     
      </Canvas>
    </div>
  );
}
