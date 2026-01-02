'use client';

// React aur Next.js imports
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';

/**
 * Dynamically import Globe component
 * SSR (Server-Side Rendering) issues se bachne ke liye dynamic import use karte hain
 * react-globe.gl library WebGL use karti hai jo server-side render nahi hoti
 */
const Globe = dynamic(
  () => import('react-globe.gl'),
  { ssr: false } // Server-side rendering disable
);

/**
 * Helper function: Country name extract karne ke liye
 * Different GeoJSON/TopoJSON sources mein alag-alag property names hote hain
 * Ye function sabhi common property names check karta hai
 * 
 * @param {Object} properties - Country feature ka properties object
 * @returns {string|null} - Country name ya null agar naam nahi mila
 */
const getCountryName = (properties) => {
  // Agar properties hi nahi hai to null return karo
  if (!properties) return null;
  
  // Multiple property names check karo (different data sources ke liye)
  return properties.NAME ||          // Most common - GeoJSON standard
         properties.name ||           // Lowercase variant
         properties.NAME_LONG ||      // Full name variant
         properties.NAME_EN ||        // English name
         properties.ADMIN ||          // Administrative name
         properties.ADMIN_A3 ||       // 3-letter admin code
         properties.NAME_SORT ||      // Sortable name
         properties.SOVEREIGNT ||     // Sovereign name
         properties.ISO_A2 ||         // ISO 2-letter code
         properties.ISO_A3 ||         // ISO 3-letter code
         null;                        // Agar kuch nahi mila to null
};

/**
 * Main Globe Component
 * 3D interactive globe display karta hai with country selection
 */
export default function GlobeWithCountries() {
  // State variables
  
  // Countries data - GeoJSON format mein { features: [...] }
  const [countries, setCountries] = useState({ features: [] });
  
  // Currently selected country name
  const [selectedCountry, setSelectedCountry] = useState(null);
  
  // Currently hovered country name (mouse over par)
  const [hoveredCountry, setHoveredCountry] = useState(null);
  
  // Globe ref - underlying Three.js scene access ke liye
  const globeRef = useRef();

  /**
   * useEffect Hook: Component mount hone par countries data load karta hai
   * Empty dependency array [] means ye sirf ek baar run hoga (component mount par)
   */
  useEffect(() => {
    /**
     * STEP 1: Pehle GeoJSON load karte hain
     * GeoJSON mein country names usually NAME property mein hote hain
     */
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(res => res.json()) // Response ko JSON mein convert karo
      .then(geojson => {
        // Debug: Console mein data log karo
        console.log('Loaded GeoJSON, countries:', geojson.features.length);
        if (geojson.features.length > 0) {
          console.log('Sample country properties:', geojson.features[0].properties);
        }
        // State mein countries data set karo
        setCountries(geojson);
      })
      .catch(err => {
        /**
         * STEP 2: Agar GeoJSON load fail ho jaye to TopoJSON try karo
         * TopoJSON smaller file size hota hai lekin names kam hote hain
         */
        console.warn('GeoJSON failed, trying TopoJSON:', err);
        
        // TopoJSON fetch karo
        fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
          .then(res => res.json())
          .then(async data => {
            /**
             * TopoJSON ko GeoJSON mein convert karna padta hai
             * topojson-client library use karte hain
             */
            const topojson = await import('topojson-client');
            
            // TopoJSON ko GeoJSON features mein convert karo
            const features = topojson.feature(data, data.objects.countries).features;
            
            console.log('Loaded TopoJSON, countries:', features.length);
            if (features.length > 0) {
              console.log('Sample TopoJSON properties:', features[0].properties);
            }
            
            // State mein set karo (GeoJSON format mein)
            setCountries({ features });
          })
          .catch(err2 => {
            // Dono sources fail ho gaye to error log karo
            console.error('Error loading map:', err2);
          });
      });
  }, []); // Empty array = sirf ek baar run hoga


  /**
   * JSX Return: Component ka UI render karta hai
   */
  return (
    // Main Container - Full screen dark background (InteractiveGlobe.jsx jaisa)
    <div style={{ 
      width: '100vw',        // Full viewport width
      height: '100vh',       // Full viewport height
      background: 'linear-gradient(to bottom right, #0a0a0a, #1a1a2e, #0a0a0a)', // Dark gradient
      position: 'relative',  // Position relative for absolute children
      overflow: 'hidden'     // Hide overflow
    }}>
      {/* 
        Globe Component - react-globe.gl library se
        Ye 3D WebGL-based interactive globe hai
        InteractiveGlobe.jsx jaisa design - blue color scheme
        Wireframe sphere aur physical material sphere effect add kiya gaya hai
      */}
      <Globe
        ref={globeRef}
        // Globe styling - InteractiveGlobe.jsx jaisa design
        // Background transparent rakho taaki container gradient dikhe
        backgroundColor="rgba(0, 0, 0, 0)"
        
        // Base globe sphere show karo (InteractiveGlobe.jsx jaisa)
        showGlobe={true}
        
        // Globe material - InteractiveGlobe.jsx ke meshPhysicalMaterial jaisa
        // Blue color scheme: #93c5fd with transparency
        // react-globe.gl mein globeMaterial function hai jo Three.js material return karta hai
        globeMaterial={() => new THREE.MeshPhysicalMaterial({
          color: '#93c5fd',
          metalness: 0.9,
          roughness: 0.5,
          ior: 1.5,
          iridescenceIOR: 1.3,
          specularIntensity: 1,
          opacity: 0.9,
          transparent: true
        })}
        
        // Atmosphere effect (optional - InteractiveGlobe.jsx mein nahi hai lekin nice lagta hai)
        showAtmosphere={false}
        
        // Globe ready callback - wireframe sphere add karne ke liye
        onGlobeReady={(globe) => {
          // Globe instance store karo ref mein
          if (globe && globe.scene) {
            globeRef.current = globe;
            
            // Wireframe sphere mesh create karo - InteractiveGlobe.jsx jaisa
            const wireframeGeometry = new THREE.SphereGeometry(1.82, 15, 15);
            const wireframeMaterial = new THREE.MeshBasicMaterial({
              color: '#7dd3fc',
              wireframe: false
            });
            const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
            wireframeMesh.renderOrder = 0;
            
            // Scene mein add karo
            globe.scene().add(wireframeMesh);
          }
        }}
        
        // Countries data (GeoJSON features array)
        polygonsData={countries.features}
        
        // Country polygons ki height (3D effect ke liye)
        polygonAltitude={0.01}
        
        /**
         * Country polygon ka top color (function jo country data ke basis par color return karta hai)
         * @param {Object} d - Country feature object
         */
        polygonCapColor={d => {
          // Country name extract karo
          const countryName = getCountryName(d.properties);
          
          // Selected country ko cyan color do
          if (selectedCountry && countryName === selectedCountry) {
            return '#00d4ff'; // Cyan
          }
          
          // Hovered country ko light blue do
          if (hoveredCountry && countryName === hoveredCountry) {
            return '#4da6ff'; // Light blue
          }
          
          // Default color - dark blue-gray
          return '#2c3e50';
        }}
        
        // Country polygon ka side color (3D effect)
        polygonSideColor={d => '#1a1a2e'}
        
        // Country borders ka color
        polygonStrokeColor={() => '#00d4ff'} // Cyan borders
        
        // Color change animations ka duration (milliseconds)
        polygonsTransitionDuration={300}
        
        /**
         * Hover Event Handler - Mouse country par hover karne par
         * @param {Object} polygon - Hovered country feature
         * @param {Object} prevPolygon - Previously hovered country
         * @param {Object} event - Mouse event
         */
        onPolygonHover={(polygon, prevPolygon, event) => {
          if (polygon) {
            // Country name extract karo
            const countryName = getCountryName(polygon.properties);
            
            if (countryName) {
              // Hovered country state update karo
              setHoveredCountry(countryName);
              console.log('Hovered country:', countryName);
              console.log('All properties:', polygon.properties);
            } else {
              // Debug: Agar naam nahi mila to log karo
              console.log('No country name found. Properties:', polygon.properties);
              setHoveredCountry(null);
            }
          } else {
            // Mouse country se hata diya to hovered state clear karo
            setHoveredCountry(null);
          }
        }}
        
        /**
         * Click Event Handler - Country par click karne par
         * @param {Object} polygon - Clicked country feature
         * @param {Object} event - Click event
         */
        onPolygonClick={(polygon, event) => {
          if (polygon) {
            // Country name extract karo
            const countryName = getCountryName(polygon.properties);
            
            if (countryName) {
              // Selected country state update karo
              setSelectedCountry(countryName);
              console.log('Selected country:', countryName);
              console.log('All properties:', polygon.properties);
            } else {
              // Debug: Agar naam nahi mila to log karo
              console.log('No country name found. Properties:', polygon.properties);
            }
          }
        }}
      />
      
      {/* 
        Hovered Country Info Box
        Display tab hota hai jab mouse kisi country par hover ho
        Sirf tab dikhata hai jab selected country nahi hai
      */}
      {hoveredCountry && !selectedCountry && (
        <div style={{
          position: 'absolute',        // Absolute positioning
          top: '20px',                // Top se 20px
          right: '20px',              // Right se 20px
          background: 'rgba(26, 26, 46, 0.9)',  // Semi-transparent dark background
          backdropFilter: 'blur(10px)',         // Blur effect
          border: '1px solid rgba(77, 166, 255, 0.3)',  // Light blue border
          borderRadius: '12px',       // Rounded corners
          padding: '15px 20px',       // Internal spacing
          color: '#4da6ff',           // Light blue text
          fontSize: '16px',
          fontWeight: '600',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',  // Shadow
          zIndex: 100                 // Top layer par
        }}>
          <strong>Hovering:</strong> {hoveredCountry}
        </div>
      )}
      
      {/* 
        Selected Country Info Box
        Display tab hota hai jab user kisi country par click kare
        Clear button bhi hai selection remove karne ke liye
      */}
      {selectedCountry && (
        <div style={{
          position: 'absolute',        // Absolute positioning
          top: '20px',                // Top se 20px
          right: '20px',              // Right se 20px
          background: 'rgba(26, 26, 46, 0.9)',  // Semi-transparent dark background
          backdropFilter: 'blur(10px)',         // Blur effect
          border: '1px solid rgba(0, 212, 255, 0.3)',  // Cyan border
          borderRadius: '12px',       // Rounded corners
          padding: '15px 20px',       // Internal spacing
          color: '#00d4ff',           // Cyan text
          fontSize: '16px',
          fontWeight: '600',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',  // Shadow
          zIndex: 100                 // Top layer par
        }}>
          {/* Selected country name display */}
          <div style={{ marginBottom: '10px' }}>
            <strong>Selected:</strong> {selectedCountry}
          </div>
          
          {/* Clear selection button */}
          <button
            onClick={() => setSelectedCountry(null)}  // Click par selection clear
            style={{
              padding: '8px 16px',
              background: 'rgba(0, 212, 255, 0.2)',    // Semi-transparent cyan
              border: '1px solid rgba(0, 212, 255, 0.4)',
              borderRadius: '6px',
              color: '#00d4ff',
              cursor: 'pointer',      // Pointer cursor on hover
              fontSize: '14px'
            }}
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
}

