import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Sphere } from "@react-three/drei";
import React, { useRef, useState } from "react";

function DraggableSphere() {
  const sphereRef = useRef();

  const [targetRotationX, setTargetRotationX] = useState(0);
  const [targetRotationY, setTargetRotationY] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(0);
  const [lastMouseY, setLastMouseY] = useState(0);

  const dragFactor = 0.005;
  const slowingFactor = 0.95;

  const handlePointerDown = (e) => {
    setMouseDown(true);
    setLastMouseX(e.clientX);
    setLastMouseY(e.clientY);
  };

  const handlePointerMove = (e) => {
    if (!mouseDown) return;
    const deltaX = e.clientX - lastMouseX;
    const deltaY = e.clientY - lastMouseY;
    setTargetRotationX(deltaX * dragFactor);
    setTargetRotationY(deltaY * dragFactor);
    setLastMouseX(e.clientX);
    setLastMouseY(e.clientY);
  };

  const handlePointerUp = () => setMouseDown(false);

  useFrame(() => {
    if (!sphereRef.current) return;
    // Rotate sphere
    sphereRef.current.rotation.y += targetRotationX;
    sphereRef.current.rotation.x += targetRotationY;
    // Slowly slow down rotation (inertia)
    setTargetRotationX((x) => x * slowingFactor);
    setTargetRotationY((y) => y * slowingFactor);
  });

  return (
    <group
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Sphere ref={sphereRef} args={[4, 90, 90]}>
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.9}
          roughness={0.2}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          specularIntensity={2}
          opacity={0.95}
          transparent
          wireframe
        />
      </Sphere>
    </group>
  );
}

export default function Index() {
  return (
    <section className="w-full h-screen bg-slate-900">
      <Canvas camera={{ position: [0, 0, 10] }}>
        {/* Fixed Lights */}
        <ambientLight intensity={5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <Environment
    files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/radkow_lake_2k.hdr" // path to HDR image
    background={false} // true -> sets it as scene background
  />
 
        {/* Sphere with mouse drag rotation */}
        <DraggableSphere />
      </Canvas>
    </section>
  );
}
