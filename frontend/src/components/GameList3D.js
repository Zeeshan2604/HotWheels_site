import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stage, OrbitControls } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";

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

export default function GameList3D({ products, navigate }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {products.map((product, index) => (
        <div
          key={product._id}
          className="group cursor-pointer"
          onClick={() => navigate(`/game/${product._id}`)}
        >
          <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl overflow-hidden border border-zinc-700/50 hover:border-red-500/50 transition-all duration-300 shadow-xl hover:shadow-[0_20px_40px_rgba(239,68,68,0.2)] aspect-square">
            <Canvas
              camera={{ position: [5, 2, 5], fov: 50, near: 0.1, far: 1000 }}
              className="w-full h-full"
            >
              <Suspense fallback={null}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                <Stage environment="dawn" intensity={0.6} adjustCamera={false}>
                  <Model modelPath={`/uploads/3dmodels/${product.model3D}`} />
                </Stage>
                <OrbitControls
                  autoRotate
                  autoRotateSpeed={1.5}
                  enableZoom={false}
                  enablePan={false}
                  minPolarAngle={Math.PI / 4}
                  maxPolarAngle={Math.PI / 2}
                  target={[0, 0, 0]}
                  minDistance={3}
                  maxDistance={8}
                />
              </Suspense>
            </Canvas>
            {/* Featured Badge */}
            {product.isFeatured && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs md:text-sm font-bold shadow-lg">
                FEATURED
              </div>
            )}
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center p-6 md:p-8">
              <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-6 md:px-8 py-3 rounded-full text-white transition-all font-bold text-base md:text-lg shadow-lg hover:shadow-red-500/25 transform hover:scale-105">
                Explore in 3D
              </button>
            </div>
          </div>
          {/* Product Info */}
          <div className="p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
              {product.name}
            </h3>
            <p className="text-gray-400 text-sm md:text-base mb-6 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  ${product.price}
                </span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 text-gray-400">
                <div className="p-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg">
                  <i className="fas fa-cube text-red-500 text-base md:text-lg"></i>
                </div>
                <span className="text-xs md:text-sm font-medium">3D Model</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 