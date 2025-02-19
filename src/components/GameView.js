import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  PresentationControls,
  Stage,
  ContactShadows
} from "@react-three/drei";

const Model = () => {
  const modelPath = "http://localhost:3000/public/uploads/mustang.glb";
  const { scene } = useGLTF(modelPath);

  return (
    <group>
      <Stage
        environment="warehouse"
        intensity={1.5}
        contactShadow={false}
        adjustCamera={false}
        preset="soft"
        shadows
      >
        <primitive
          object={scene}
          scale={0.03}
          position={[0, -0.5, 0]}
        />
      </Stage>

      {/* Platform with black border */}
      <group position={[0, -2.2, 0]}>
        {/* Main white platform */}
        <mesh receiveShadow>
          <cylinderGeometry args={[10, 10, 0.2, 32]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        
        {/* Black border */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[10.1, 10.1, 0.19, 32]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>

      {/* Enhanced Shadow - adjusted to new platform position */}
      <ContactShadows
        position={[0, -1.19, 0]}
        opacity={0.3}
        scale={50}
        blur={2}
        far={4.5}
        color="#000000"
      />
    </group>
  );
};

const PalmTree = ({ position, scale = 1 }) => {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 2, 0]}>
        <cylinderGeometry args={[0.1, 0.2, 4, 6]} />
        <meshStandardMaterial color="#6f4e37" roughness={0.8} />
      </mesh>

      {[...Array(6)].map((_, i) => (
        <group
          key={i}
          rotation={[
            0.2,
            (Math.PI * 2 * i) / 6 + Math.random() * 0.5,
            Math.random() * 0.2 + 0.3
          ]}
          position={[0, 3.8, 0]}
        >
          <mesh castShadow>
            <coneGeometry args={[0.5, 2, 2]} />
            <meshStandardMaterial color="#2b9348" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const GameView = () => {
  const [isRotating, setIsRotating] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const canvasRef = useRef(null);
  const controlsRef = useRef(null);

  const handleRotate = () => {
    setIsRotating(!isRotating);
  };

  const handleFullScreen = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      if (!document.fullscreenElement) {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'fixed';
        wrapper.style.top = '50%';
        wrapper.style.left = '50%';
        wrapper.style.transform = 'translate(-50%, -50%)';
        wrapper.style.width = '90vw';
        wrapper.style.height = '90vh';
        wrapper.style.backgroundColor = '#18181b';
        wrapper.style.borderRadius = '1rem';
        wrapper.style.overflow = 'hidden';
        wrapper.style.boxShadow = '0 0 0 100vw rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)';
        wrapper.style.zIndex = '9999';
        wrapper.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        wrapper.style.padding = '1rem';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';

        const header = document.createElement('div');
        header.style.position = 'relative';
        header.style.width = '100%';
        header.style.padding = '1rem';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)';
        header.style.marginBottom = '1rem';

        const title = document.createElement('span');
        title.textContent = '3D View';
        title.style.color = 'white';
        title.style.fontWeight = 'bold';
        header.appendChild(title);

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '<i class="fa-solid fa-times"></i>';
        closeButton.style.background = 'rgba(0, 0, 0, 0.5)';
        closeButton.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        closeButton.style.color = 'white';
        closeButton.style.width = '32px';
        closeButton.style.height = '32px';
        closeButton.style.borderRadius = '50%';
        closeButton.style.cursor = 'pointer';
        closeButton.style.display = 'flex';
        closeButton.style.alignItems = 'center';
        closeButton.style.justifyContent = 'center';
        closeButton.style.transition = 'all 0.2s';
        closeButton.style.zIndex = '10';
        
        closeButton.onmouseover = () => {
          closeButton.style.background = '#ef4444';
          closeButton.style.borderColor = '#ef4444';
        };
        closeButton.onmouseout = () => {
          closeButton.style.background = 'rgba(0, 0, 0, 0.5)';
          closeButton.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        };
        header.appendChild(closeButton);

        const canvasContainer = document.createElement('div');
        canvasContainer.style.position = 'relative';
        canvasContainer.style.flex = '1';
        canvasContainer.style.width = '100%';
        canvasContainer.style.display = 'flex';
        canvasContainer.style.alignItems = 'center';
        canvasContainer.style.justifyContent = 'center';
        canvasContainer.className = 'canvas-container';

        // Maintain aspect ratio
        const aspectWrapper = document.createElement('div');
        aspectWrapper.style.width = '100%';
        aspectWrapper.style.height = '100%';
        aspectWrapper.style.display = 'flex';
        aspectWrapper.style.alignItems = 'center';
        aspectWrapper.style.justifyContent = 'center';
        
        canvas.style.width = 'auto';
        canvas.style.height = '90%';  // Slightly smaller to show more environment
        canvas.style.aspectRatio = '1/1';  // Keep square ratio

        aspectWrapper.appendChild(canvas);
        canvasContainer.appendChild(aspectWrapper);
        wrapper.appendChild(header);
        wrapper.appendChild(canvasContainer);
        document.body.appendChild(wrapper);

        // Adjust camera for fullscreen without changing aspect
        if (canvas.__r3f?.state) {
          const state = canvas.__r3f.state;
          requestAnimationFrame(() => {
            const camera = state.camera;
            camera.fov = 60;  // Wider field of view to show more environment
            camera.position.set(18, 5, 18);  // Move camera back to show more
            camera.updateProjectionMatrix();
          });
        }

        setIsFullScreen(true);

        wrapper.cleanup = () => {
          const originalContainer = document.querySelector('.main-canvas-container');
          originalContainer.appendChild(canvas);
          document.body.removeChild(wrapper);
          
          // Reset camera to original settings
          if (canvas.__r3f?.state?.camera) {
            requestAnimationFrame(() => {
              const camera = canvas.__r3f.state.camera;
              camera.fov = 45;  // Reset FOV
              camera.position.set(12, 3, 12);  // Reset position
              camera.updateProjectionMatrix();
            });
          }
          setIsFullScreen(false);
        };

        closeButton.onclick = wrapper.cleanup;
      } else {
        const wrapper = canvas.parentElement.parentElement.parentElement;
        if (wrapper.cleanup) {
          wrapper.cleanup();
        }
      }
    }
  };

  useEffect(() => {
    let animationFrameId;
    
    const rotateCamera = () => {
      if (isRotating && controlsRef.current) {
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = 1.0;
        controlsRef.current.update();
      } else if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
      }
      animationFrameId = requestAnimationFrame(rotateCamera);
    };
    
    rotateCamera();
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
      }
    };
  }, [isRotating]);

  return (
    <div id="root">
      <section
        id="interactive_showcase"
        className="min-h-screen bg-black text-white py-20"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Experience in 3D
            </h2>
            <p className="text-gray-400 text-lg">
              Explore every detail of our premium die-cast models with our
              interactive 3D viewer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-red-500/10 z-10 pointer-events-none"></div>
              
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-red-950/20 main-canvas-container">
                <Canvas
                  ref={canvasRef}
                  camera={{ 
                    position: [12, 3, 12],
                    fov: 45,
                    near: 0.1,
                    far: 1000
                  }}
                  shadows
                  dpr={[1, 2]}
                  className="w-full h-full"
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                >
                  <color attach="background" args={['#1a1a2e']} />
                  <fog attach="fog" args={['#1a1a2e', 5, 30]} />
                  
                  <Suspense fallback={null}>
                    <Model />
                    <Environment
                      preset="sunset"
                      background={false}
                      blur={0.5}
                    />
                    
                    <spotLight
                      position={[10, 15, 10]}
                      angle={0.3}
                      penumbra={1}
                      intensity={2}
                      castShadow
                      color="#ffd700"
                      shadow-bias={-0.0001}
                    />
                    <spotLight
                      position={[-15, 5, -10]}
                      angle={0.3}
                      penumbra={1}
                      intensity={1}
                      castShadow
                      color="#60a5fa"
                    />
                    <spotLight
                      position={[-5, 8, 15]}
                      angle={0.5}
                      penumbra={0.5}
                      intensity={1.5}
                      castShadow
                      color="#ffd1d1"
                    />
                    <ambientLight intensity={0.4} color="#87ceeb" />
                    
                    <OrbitControls
                      ref={controlsRef}
                      enableZoom={true}
                      enablePan={false}
                      enableRotate={true}
                      minPolarAngle={Math.PI / 3}
                      maxPolarAngle={Math.PI / 2}
                      minAzimuthAngle={-Infinity}
                      maxAzimuthAngle={Infinity}
                      rotateSpeed={0.5}
                      zoomSpeed={0.5}
                      minDistance={8}
                      maxDistance={20}
                      target={[0, 0, 0]}
                      enableDamping={true}
                      dampingFactor={0.05}
                    />
                  </Suspense>
                </Canvas>
              </div>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-20">
                <button
                  onClick={handleRotate}
                  className="w-12 h-12 rounded-full bg-black/50 hover:bg-red-500 flex items-center justify-center backdrop-blur-sm transition-all border border-white/10"
                >
                  <i className={`fa-solid ${isRotating ? 'fa-pause' : 'fa-play'} text-white`}></i>
                </button>
                <button
                  onClick={handleFullScreen}
                  className="w-12 h-12 rounded-full bg-black/50 hover:bg-red-500 flex items-center justify-center backdrop-blur-sm transition-all border border-white/10"
                >
                  <i className={`fa-solid ${isFullScreen ? 'fa-compress' : 'fa-expand'} text-white`}></i>
                </button>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold">GT Racing Pro X</h3>
                <p className="text-gray-400">
                  Experience the perfect blend of classic design and modern
                  engineering with our latest premium model.
                </p>
              </div>

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
