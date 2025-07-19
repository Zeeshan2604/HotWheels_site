import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Stage, Sparkles, Html } from "@react-three/drei";

function Model({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  React.useEffect(() => {
    if (scene) {
      scene.position.set(0, 0, 0);
      scene.scale.set(1, 1, 1);
      scene.rotation.set(0, 0, 0);
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.transparent = false;
            child.material.opacity = 1;
          }
        }
      });
    }
  }, [scene]);
  return scene ? <primitive object={scene} /> : null;
}

export default function GameView3D({ product, autoRotate, setAutoRotate }) {
  if (!product?.model3D) return null;
  return (
    <div className="aspect-square relative">
      {/* 3D View Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <button
          onClick={() => setAutoRotate && setAutoRotate((prev) => !prev)}
          className={`p-2 rounded-lg transition-all duration-300 backdrop-blur-md border ${
            autoRotate
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 border-red-400/50'
              : 'bg-zinc-900/80 text-gray-400 hover:bg-zinc-800/80 border-zinc-700/50'
          }`}
        >
          <i className="fas fa-sync-alt text-sm"></i>
        </button>
      </div>
      <Canvas camera={{ position: [0, 2, 8], fov: 45, near: 0.1, far: 1000 }}>
        <Suspense fallback={
          <Html center>
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-white text-sm font-medium">Loading model...</div>
            </div>
          </Html>
        }>
          {/* Scene Lighting */}
          <ambientLight intensity={0.8} />
          <directionalLight
            position={[5, 10, 7]}
            intensity={1.8}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          {/* Flying Particles */}
          <Sparkles
            count={100}
            size={3}
            speed={0.3}
            opacity={0.6}
            color="#ef4444"
            scale={20}
            noise={0.8}
            position={[0, 0, 0]}
            depth={10}
            fade={false}
            spawnRate={0.3}
          />
          {/* Main Model Display */}
          <Model modelPath={`/uploads/3dmodels/${product.model3D}`} />
          {/* Camera Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
            maxDistance={9}
            minDistance={1}
            minPolarAngle={Math.PI/6}
            maxPolarAngle={Math.PI/2}
            target={[0, 0, 0]}
            dampingFactor={0.1}
          />
          {/* Environment Background */}
          <Environment preset="sunset" background blur={0.2} />
        </Suspense>
      </Canvas>
    </div>
  );
} 