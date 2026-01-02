'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import styles from './Globe.module.css';

export default function ReactGlobe() {
  const svgRef = useRef(null);
  const [rotation, setRotation] = useState([0, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [scale, setScale] = useState(200);
  const zoomTransformRef = useRef(null);

  const width = 800;
  const height = 800;

  // Load world data
  useEffect(() => {
    // Try GeoJSON first (has country names), fallback to TopoJSON
    d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(geojson => {
        setCountries(geojson.features);
        // Debug: log first country to see properties
        if (geojson.features.length > 0) {
          console.log('Sample country properties:', geojson.features[0].properties);
        }
      })
      .catch(err => {
        console.warn('GeoJSON failed, trying TopoJSON:', err);
        // Fallback to TopoJSON
        d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
          .then(world => {
            const features = topojson.feature(world, world.objects.countries).features;
            setCountries(features);
            // Debug: log first country to see properties
            if (features.length > 0) {
              console.log('Sample country properties (TopoJSON):', features[0].properties);
            }
          })
          .catch(err2 => {
            console.error('Error loading map:', err2);
            alert('Failed to load world map data. Please check your internet connection.');
          });
      });
  }, []);

  // Render globe
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    if (!svg.node() || countries.length === 0) return;

    // Clear previous render
    svg.select('.countries').remove();
    svg.select('.globe-bg').remove();

    // Projection setup
    const projection = d3.geoOrthographic()
      .scale(scale)
      .translate([width / 2, height / 2])
      .rotate(rotation)
      .clipAngle(90);

    const path = d3.geoPath().projection(projection);

    // Background circle (globe base)
    svg.append('circle')
      .attr('class', 'globe-bg')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', scale)
      .attr('fill', '#1a1a2e')
      .attr('stroke', '#00d4ff')
      .attr('stroke-width', 2);

    // Countries group
    const countriesGroup = svg.append('g').attr('class', 'countries');

    // Draw countries
    countriesGroup.selectAll('path')
      .data(countries)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', d => {
        const props = d.properties || {};
        const countryName = props.NAME || 
                            props.name || 
                            props.NAME_LONG ||
                            props.NAME_EN ||
                            props.ADMIN ||
                            props.ADMIN_A3 ||
                            props.NAME_SORT ||
                            props.SOVEREIGNT ||
                            `Country ${d.id || 'Unknown'}`;

        if (selectedCountry && countryName === selectedCountry) {
          return '#00d4ff'; // Cyan for selected
        }
        return '#2c3e50'; // Default dark blue-gray
      })
      .attr('stroke', '#00d4ff')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        const props = d.properties || {};
        const countryName = props.NAME || 
                            props.name || 
                            props.NAME_LONG ||
                            props.NAME_EN ||
                            props.ADMIN ||
                            props.ADMIN_A3 ||
                            props.NAME_SORT ||
                            props.SOVEREIGNT ||
                            `Country ${d.id || 'Unknown'}`;

        setSelectedCountry(countryName);
        console.log('Selected country:', countryName);
      })
      .on('mouseenter', function(event, d) {
        const props = d.properties || {};
        const countryName = props.NAME || 
                            props.name || 
                            props.NAME_LONG ||
                            props.NAME_EN ||
                            props.ADMIN ||
                            props.ADMIN_A3 ||
                            props.NAME_SORT ||
                            props.SOVEREIGNT ||
                            `Country ${d.id || 'Unknown'}`;

        console.log('Country:', countryName);
        d3.select(this)
          .attr('fill', '#00d4ff')
          .attr('stroke-width', 1);
      })
      .on('mouseleave', function(event, d) {
        const props = d.properties || {};
        const countryName = props.NAME || 
                            props.name || 
                            props.NAME_LONG ||
                            props.NAME_EN ||
                            props.ADMIN ||
                            props.ADMIN_A3 ||
                            props.NAME_SORT ||
                            props.SOVEREIGNT ||
                            `Country ${d.id || 'Unknown'}`;

        d3.select(this)
          .attr('fill', d => {
            if (selectedCountry && countryName === selectedCountry) {
              return '#00d4ff';
            }
            return '#2c3e50';
          })
          .attr('stroke-width', 0.5);
      });

    // Drag handler for rotation
    const drag = d3.drag()
      .on('start', () => {
        setIsDragging(true);
        setAutoRotate(false);
      })
      .on('drag', (event) => {
        setRotation(prev => [
          prev[0] + event.dx * 0.5,
          prev[1] - event.dy * 0.5
        ]);
      })
      .on('end', () => setIsDragging(false));

    svg.call(drag);

    // Zoom handler
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        zoomTransformRef.current = event.transform;
        const newScale = scale * event.transform.k;
        projection.scale(newScale);
        countriesGroup.selectAll('path').attr('d', path);
        svg.select('.globe-bg').attr('r', newScale);
      });

    svg.call(zoom);

    // Cleanup
    return () => {
      svg.selectAll('*').remove();
    };
  }, [rotation, countries, selectedCountry, scale, width, height]);

  // Auto rotate effect
  useEffect(() => {
    if (autoRotate) {
      const interval = setInterval(() => {
        setRotation(prev => [prev[0] + 0.5, prev[1]]);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [autoRotate]);

  return (
    <div className={styles.globeWrapper}>
      <div className={styles.controls}>
        <h3 className={styles.title}>🌍 Globe Controls</h3>
        <div className={styles.buttonGroup}>
          <button 
            onClick={() => setRotation([0, 0])}
            className={styles.button}
          >
            Reset Rotation
          </button>
          <button 
            onClick={() => setAutoRotate(!autoRotate)}
            className={styles.button}
          >
            {autoRotate ? '⏸ Stop' : '▶ Start'} Auto Rotate
          </button>
          <button 
            onClick={() => setSelectedCountry(null)}
            className={styles.button}
          >
            Clear Selection
          </button>
          <button 
            onClick={() => {
              setScale(200);
              if (svgRef.current) {
                const svg = d3.select(svgRef.current);
                svg.call(d3.zoom().transform, d3.zoomIdentity);
                zoomTransformRef.current = d3.zoomIdentity;
              }
            }}
            className={styles.button}
          >
            Reset Zoom
          </button>
        </div>
        {selectedCountry && (
          <div className={styles.selectedCountry}>
            <strong>Selected:</strong> {selectedCountry}
          </div>
        )}
      </div>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className={`${styles.globeSvg} ${isDragging ? styles.dragging : ''}`}
      />
      <div className={styles.instructions}>
        <p>
          🖱️ <strong>Drag</strong> to rotate | 
          🔍 <strong>Scroll</strong> to zoom | 
          👆 <strong>Click</strong> country to select
        </p>
      </div>
    </div>
  );
}

