import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Line } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import PlanetInfo from "./PlanetInfo";

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

const planetsData = [
  { name: "Mercury", size: 1.2, texture: mercuryTexture, distance: 15, speed: 0.001, description: "Closest planet to the Sun." },
  { name: "Venus", size: 1.8, texture: venusTexture, distance: 25, speed: 0.001, description: "Hottest planet in our Solar System." },
  { name: "Earth", size: 2, texture: earthTexture, distance: 35, speed: 0.001, hasMoon: true, moonSize: 0.5, moonTexture: moonTexture, moonDistance: 3, moonSpeed: 0.03, description: "Our home planet." },
  { name: "Mars", size: 1.5, texture: marsTexture, distance: 50, speed: 0.001, description: "The Red Planet." },
  { name: "Jupiter", size: 5, texture: jupiterTexture, distance: 70, speed: 0.001, description: "Largest planet in the Solar System." },
  { name: "Saturn", size: 4.5, texture: saturnTexture, distance: 90, speed: 0.001, description: "Famous for its rings." },
  { name: "Uranus", size: 3.5, texture: uranusTexture, distance: 110, speed: 0.001, description: "Rotates on its side." },
  { name: "Neptune", size: 3.2, texture: neptuneTexture, distance: 130, speed: 0.001, description: "Farthest planet from the Sun." },
];

const Planet = ({ planet, onClick }) => {
  const mesh = useRef();
  const angle = useRef(0);

  const textureMap = useMemo(() => new THREE.TextureLoader().load(planet.texture), [planet.texture]);

  useFrame(() => {
    angle.current += planet.speed;
    mesh.current.position.x = planet.distance * Math.cos(angle.current);
    mesh.current.position.z = planet.distance * Math.sin(angle.current);
  });

  return (
    <mesh ref={mesh} onClick={() => onClick(planet)}>
      <sphereGeometry args={[planet.size, 32, 32]} />
      <meshStandardMaterial map={textureMap} />
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
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  return (
    <>
      <Canvas camera={{ position: [0, 150, 300], fov: 75 }} fog={null}>

        <ambientLight intensity={0.8} />
        <pointLight intensity={3} position={[0, 0, 0]} />

        <Stars radius={0} depth={500} count={20000} factor={5} saturation={0.5} fade />

        <mesh>
          <sphereGeometry args={[10, 32, 32]} />
          <meshBasicMaterial map={new THREE.TextureLoader().load(sunTexture)} />
        </mesh>

        {planetsData.map((planet, index) => (
          <React.Fragment key={index}>
            <Orbit distance={planet.distance} />
            <Planet planet={planet} onClick={setSelectedPlanet} />
          </React.Fragment>
        ))}

        <Rings size={6} texture={saturnRingTexture} />

        <OrbitControls enableDamping dampingFactor={0.1} enableZoom enablePan maxDistance={500} minDistance={50} makeDefault />
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
        </EffectComposer>
      </Canvas>

      <PlanetInfo planet={selectedPlanet} />
    </>
  );
};

export default SolarSystem;
