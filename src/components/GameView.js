import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const GameView = () => {
  const { scene } = useGLTF("http://localhost:3000/uploads/mustang.glb");

  // State to control rotation and fullscreen mode
  const [isRotating, setIsRotating] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);

  const canvasRef = useRef(null);

  // Handle rotating the model
  const handleRotate = () => {
    setIsRotating(!isRotating); // Toggle rotation
  };

  // Handle fullscreen mode
  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen); // Toggle fullscreen
  };

  // Animation loop for rotating the model
  useEffect(() => {
    let animationFrameId;

    const rotateModel = () => {
      if (isRotating) {
        setRotationAngle((prevAngle) => prevAngle + 0.001); // Increment the rotation angle
      }
      animationFrameId = requestAnimationFrame(rotateModel);
    };

    rotateModel();

    return () => cancelAnimationFrame(animationFrameId); // Clean up the animation on unmount
  }, [isRotating]);

  return (
    <div id="root">
      <section
        id="interactive_showcase"
        className="min-h-screen bg-black text-white py-20"
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Experience in 3D
            </h2>
            <p className="text-gray-400 text-lg">
              Explore every detail of our premium die-cast models with our
              interactive 3D viewer.
            </p>
          </div>

          {/* Interactive Display */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* 3D Viewer Section */}
            <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-purple-500/10 rounded-2xl"></div>
              <Canvas
                ref={canvasRef}
                camera={{ position: [20, 10, -15], fov: 50 }}
              >
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} />
                <directionalLight position={[-10, -10, 5]} intensity={0.8} />
                <directionalLight position={[10, 0, 0]} intensity={1} />
                <directionalLight position={[0, 0, -25]} intensity={1} />
                <OrbitControls />
                <mesh rotation={[0, rotationAngle, 0]}>
                  <primitive
                    object={scene}
                    scale={0.05}
                    position={[-3, -2, -0]}
                  />
                </mesh>
              </Canvas>

              {/* Interactive Controls */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                {/* Rotate button */}
                <button
                  onClick={handleRotate}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-sm transition-all"
                >
                  <i className="fa-solid fa-rotate text-white"></i>
                </button>
                {/* Fullscreen button */}
                <button
                  onClick={handleFullScreen}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-sm transition-all"
                >
                  <i className="fa-solid fa-expand text-white"></i>
                </button>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold">GT Racing Pro X</h3>
                <p className="text-gray-400">
                  Experience the perfect blend of classic design and modern
                  engineering with our latest premium model.
                </p>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-zinc-900">
                  <div className="text-red-500 mb-2">
                    <i className="fa-solid fa-ruler text-xl"></i>
                  </div>
                  <h4 className="font-semibold mb-1">Scale</h4>
                  <p className="text-gray-400">1:64</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900">
                  <div className="text-red-500 mb-2">
                    <i className="fa-solid fa-paint-roller text-xl"></i>
                  </div>
                  <h4 className="font-semibold mb-1">Material</h4>
                  <p className="text-gray-400">Die-cast Metal</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900">
                  <div className="text-red-500 mb-2">
                    <i className="fa-solid fa-certificate text-xl"></i>
                  </div>
                  <h4 className="font-semibold mb-1">Edition</h4>
                  <p className="text-gray-400">Limited Series</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900">
                  <div className="text-red-500 mb-2">
                    <i className="fa-solid fa-box text-xl"></i>
                  </div>
                  <h4 className="font-semibold mb-1">Package</h4>
                  <p className="text-gray-400">Collector Box</p>
                </div>
              </div>

              {/* Call to Action */}
              {/* <div className="flex gap-4">
                <button className="flex-1 py-3 bg-green-500 hover:bg-green-600 rounded-full transition-colors">
                  Play Game
                </button>
              </div> */}

              <div className="flex gap-4">
                <button className="flex-1 py-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors">
                  Add to Cart - $24.99
                </button>
                <button className="w-12 h-12 rounded-full border border-white/20 hover:border-white/40 flex items-center justify-center">
                  <i className="fa-regular fa-heart"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GameView;
