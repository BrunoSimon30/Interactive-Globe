'use client';

/**
 * Globe with Text Approach
 * Route: /globe-text
 * 
 * Creates a globe using text characters arranged in 3D space
 * Text se globe banaya gaya hai
 */

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

// Text Globe Component - text characters se globe banaya
function TextGlobe() {
  const groupRef = useRef();
  const [countries, setCountries] = useState([]);
  
  // Load textures
  const earthTexture = useTexture('/textures/earth.jpg');
  const earthLights = useTexture('/textures/earth_lights.webp');
  const cloudsTexture = useTexture('/textures/clouds.jpg');
  
  // Custom shader material for transparent water
  const materialRef = useRef();
  
  useEffect(() => {
    if (materialRef.current && earthTexture) {
      // Create custom shader material
      const material = materialRef.current;
      material.onBeforeCompile = (shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <output_fragment>',
          `
          vec4 texColor = texture2D(map, vUv);
          float brightness = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
          // Dark areas (water) ko transparent karo, light areas (land) ko visible rakho
          float alpha = smoothstep(0.2, 0.5, brightness);
          gl_FragColor = vec4(texColor.rgb, alpha * 0.8);
          `
        );
      };
    }
  }, [earthTexture]);

  // GeoJSON data load karna
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(res => res.json())
      .then(geojson => {
        console.log('Loaded countries:', geojson.features.length);
        setCountries(geojson.features);
      })
      .catch(err => {
        console.error('Error loading GeoJSON:', err);
      });
  }, []);

  // Auto rotation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  // Convert lat/lon to 3D position on sphere
  const latLonToPosition = (lat, lon, radius = 2) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    
    return [x, y, z];
  };

  // Get country name from properties
  const getCountryName = (feature) => {
    return feature.properties?.NAME || 
           feature.properties?.name || 
           feature.properties?.NAME_EN || 
           '●';
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0, -1, 0]}>
      {/* Main sphere with texture - transparent water, sirf zameen dikhegi */}
      <mesh>
        <sphereGeometry args={[2, 90, 90]} />
        <meshStandardMaterial 
          ref={materialRef}
          map={earthTexture}
          emissiveMap={earthLights}
          emissiveIntensity={0.2}
          roughness={0.8}
          metalness={0.1}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Countries as text on sphere surface */}
      {countries.map((feature, index) => {
        if (!feature.geometry || !feature.geometry.coordinates) return null;
        
        // Get centroid or first coordinate
        let lat, lon;
        
        if (feature.geometry.type === 'Polygon') {
          const coords = feature.geometry.coordinates[0];
          // Calculate centroid
          let sumLat = 0, sumLon = 0;
          coords.forEach(coord => {
            sumLon += coord[0];
            sumLat += coord[1];
          });
          lon = sumLon / coords.length;
          lat = sumLat / coords.length;
        } else if (feature.geometry.type === 'MultiPolygon') {
          const coords = feature.geometry.coordinates[0][0];
          let sumLat = 0, sumLon = 0;
          coords.forEach(coord => {
            sumLon += coord[0];
            sumLat += coord[1];
          });
          lon = sumLon / coords.length;
          lat = sumLat / coords.length;
        } else {
          return null;
        }

        const [x, y, z] = latLonToPosition(lat, lon, 2.01);
        const countryName = getCountryName(feature);
        
        // Use first character or symbol for smaller countries
        const displayText = countryName.length > 10 
          ? countryName.substring(0, 3).toUpperCase() 
          : countryName.length > 1 
          ? countryName.substring(0, 2).toUpperCase()
          : countryName;

        return (
          <Text
            key={index}
            position={[x, y, z]}
            fontSize={0.08}
            color="#00d4ff"
            anchorX="center"
            anchorY="middle"
            // Make text face camera
            rotation={[
              Math.atan2(y, Math.sqrt(x * x + z * z)),
              Math.atan2(x, z),
              0
            ]}
          >
            {displayText}
          </Text>
        );
      })}
    </group>
  );
}

// Alternative: Simple text particles approach
function TextParticlesGlobe() {
  const groupRef = useRef();
  const [particles, setParticles] = useState([]);
  
  // Load textures
  const earthTexture = useTexture('/textures/earth.jpg');
  const earthLights = useTexture('/textures/earth_lights.webp');
  
  // Custom shader material for transparent water
  const materialRef = useRef();
  
  useEffect(() => {
    if (materialRef.current && earthTexture) {
      const material = materialRef.current;
      material.onBeforeCompile = (shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <output_fragment>',
          `
          vec4 texColor = texture2D(map, vUv);
          float brightness = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
          // Dark areas (water) ko transparent karo, light areas (land) ko visible rakho
          float alpha = smoothstep(0.2, 0.5, brightness);
          gl_FragColor = vec4(texColor.rgb, alpha * 0.8);
          `
        );
      };
    }
  }, [earthTexture]);

  // Create text particles in sphere shape
  useEffect(() => {
    const newParticles = [];
    const radius = 2;
    const count = 500; // Number of text particles

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2; // Longitude
      const phi = Math.acos(Math.random() * 2 - 1); // Latitude
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      const chars = ['●', '■', '▲', '◆', '★', '☆'];
      newParticles.push({
        position: [x, y, z],
        char: chars[Math.floor(Math.random() * chars.length)],
      });
    }

    setParticles(newParticles);
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main sphere with texture - transparent water, sirf zameen dikhegi */}
      <mesh>
        <sphereGeometry args={[2, 90, 90]} />
        <meshStandardMaterial 
          ref={materialRef}
          map={earthTexture}
          emissiveMap={earthLights}
          emissiveIntensity={0.2}
          roughness={0.8}
          metalness={0.1}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Text particles */}
      {particles.map((particle, index) => (
        <Text
          key={index}
          position={particle.position}
          fontSize={0.05}
          color="#00d4ff"
          anchorX="center"
          anchorY="middle"
        >
          {particle.char}
        </Text>
      ))}
    </group>
  );
}

// Main Page Component
export default function GlobeText() {
  const [mode, setMode] = useState('countries'); // 'countries' or 'particles'

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
        <h1 className="text-white text-lg font-bold mb-2">Text Globe</h1>
        <p className="text-slate-400 text-sm mb-3">Text se banaya hua globe with textures</p>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => setMode('countries')}
              className={`px-3 py-1 rounded text-sm ${
                mode === 'countries'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Countries
            </button>
            <button
              onClick={() => setMode('particles')}
              className={`px-3 py-1 rounded text-sm ${
                mode === 'particles'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Particles
            </button>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Using: earth.jpg + earth_lights.webp + clouds.jpg
          </div>
        </div>
      </div>
      
      <Canvas
        camera={{ position: [0, 0, 8], fov: 65 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={1.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={Math.PI / 6}
          penumbra={0.3}
          intensity={100}
          color="#fff"
          castShadow={false}
        />

        {mode === 'countries' ? <TextGlobe /> : <TextParticlesGlobe />}

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          mouseButtons={{
            LEFT: 0,
            MIDDLE: -1,
            RIGHT: 2,
          }}
        />
      </Canvas>
    </div>
  );
}

