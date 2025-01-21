import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Line } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// Importing textures
import sunTexture from "../assets/sun.jpg";
import mercuryTexture from "../assets/mercury.jpg";
import venusTexture from "../assets/venus_surface.jpg";
import earthTexture from "../assets/earth.jpg";
import moonTexture from "../assets/moon.jpg";
import marsTexture from "../assets/mars.jpg";
import jupiterTexture from "../assets/jupiter.jpg";
import saturnTexture from "../assets/saturn.jpg";
import saturnRingTexture from "../assets/saturn_ring_alpha.png";
import uranusTexture from "../assets/uranus.jpg";
import neptuneTexture from "../assets/neptune.jpg";

const Planet = ({ size, texture, distance, speed, hasMoon = false, moonSize, moonTexture, moonDistance, moonSpeed }) => {
  const mesh = useRef();
  const angle = useRef(0);
  const moonAngle = useRef(0);

  const textureMap = useMemo(() => new THREE.TextureLoader().load(texture), [texture]);
  const moonTextureMap = useMemo(() => moonTexture && new THREE.TextureLoader().load(moonTexture), [moonTexture]);

  useFrame(() => {
    angle.current += speed;
    mesh.current.position.x = distance * Math.cos(angle.current);
    mesh.current.position.z = distance * Math.sin(angle.current);

    if (hasMoon) {
        moonAngle.current += moonSpeed;
        const moonMesh = mesh.current.children[0];
        moonMesh.position.x = mesh.current.position.x + moonDistance * Math.cos(moonAngle.current);
        moonMesh.position.z = mesh.current.position.z + moonDistance * Math.sin(moonAngle.current);
      }
      
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial map={textureMap} />
      {hasMoon && (
        <mesh>
          <sphereGeometry args={[moonSize, 32, 32]} />
          <meshStandardMaterial map={moonTextureMap} />
        </mesh>
      )}
    </mesh>
  );
};

const Orbit = ({ distance }) => {
    const points = new Array(101).fill(0).map((_, i) => {
      const angle = (i / 100) * Math.PI * 2; 
      return [distance * Math.cos(angle), 0, distance * Math.sin(angle)];
    });
  
    return <Line points={points} color="gray" lineWidth={1} />;
  };
  

const Rings = ({ size, texture }) => {
  const ringTexture = useMemo(() => new THREE.TextureLoader().load(texture), [texture]);

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[size, size + 1, 64]} />
      <meshStandardMaterial map={ringTexture} side={THREE.DoubleSide} transparent />
    </mesh>
  );
};

const SolarSystem = () => {
  return (
    <Canvas camera={{ position: [0, 150, 300], fov: 75 }}>
      <ambientLight intensity={0.8} />
      <pointLight intensity={3} position={[0, 0, 0]} />

      <Stars radius={300} depth={60} count={15000} factor={5} saturation={0.5} fade />

      <mesh>
        <sphereGeometry args={[10, 32, 32]} />
        <meshBasicMaterial map={new THREE.TextureLoader().load(sunTexture)} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={3} />

      <Orbit distance={15} />
      <Planet size={1.2} texture={mercuryTexture} distance={15} speed={0.02} />

      <Orbit distance={25} />
      <Planet size={1.8} texture={venusTexture} distance={25} speed={0.015} />

      <Orbit distance={35} />
      <Planet
        size={2}
        texture={earthTexture}
        distance={35}
        speed={0.01}
        hasMoon
        moonSize={0.5}
        moonTexture={moonTexture}
        moonDistance={3}
        moonSpeed={0.03}
      />

      <Orbit distance={50} />
      <Planet size={1.5} texture={marsTexture} distance={50} speed={0.008} />

      <Orbit distance={70} />
      <Planet size={5} texture={jupiterTexture} distance={70} speed={0.005} />

      <Orbit distance={90} />
      <Planet size={4.5} texture={saturnTexture} distance={90} speed={0.004} />
      <Rings size={6} texture={saturnRingTexture} />

      <Orbit distance={110} />
      <Planet size={3.5} texture={uranusTexture} distance={110} speed={0.003} />

      <Orbit distance={130} />
      <Planet size={3.2} texture={neptuneTexture} distance={130} speed={0.002} />

      <OrbitControls
        enableDamping
        dampingFactor={0.1}
        enableZoom
        enablePan
        maxDistance={500}
        minDistance={50}
        makeDefault
      />
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
      </EffectComposer>
    </Canvas>
  );
};

export default SolarSystem;
