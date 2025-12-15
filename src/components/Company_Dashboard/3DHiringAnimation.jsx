import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Floating 3D elements with rotation and subtle vertical movement
function FloatingElements() {
  const groupRef = useRef(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#3B82F6" />
      </mesh>
      <mesh position={[1.2, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#F97316" />
      </mesh>
      <mesh position={[-1.2, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color="#10B981" />
      </mesh>
      <mesh position={[0.6, 1, 0.6]} castShadow receiveShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#8B5CF6" />
      </mesh>
      <mesh position={[-0.8, -0.7, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.15, 0.15]} />
        <meshStandardMaterial color="#EF4444" />
      </mesh>
    </group>
  );
}

// 3D Scene setup with lights and controls
function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.8} 
        castShadow 
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <FloatingElements />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={1}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </>
  );
}

// Main component rendering the animated 3D hiring visualization
export default function HiringAnimation3D() {
  return (
    <motion.div 
      className="w-full h-48 lg:h-80"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <Canvas 
        camera={{ position: [3, 2, 3], fov: 50 }} 
        shadows
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </motion.div>
  );
}
