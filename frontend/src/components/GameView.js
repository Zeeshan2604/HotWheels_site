import React, { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  Stage,
  ContactShadows,
  Sparkles,
  Html
} from "@react-three/drei";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Model({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} />;
}

// Preload the model
useGLTF.preload("http://localhost:3000/public/uploads/3dmodels/ferrari_f8_tributo.glb");

const GameView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading product:', err);
        navigate('/');
      }
    };
    
    if(id === 'random') {
      // Fetch random product with 3D model
      axios.get('http://localhost:3000/api/v1/products?has3DModel=true')
        .then(res => {
          const validProducts = res.data.filter(p => p.model3D);
          if(validProducts.length > 0) {
            const randomProduct = validProducts[Math.floor(Math.random() * validProducts.length)];
            navigate(`/game/${randomProduct._id}`, { replace: true });
          } else {
            navigate('/');
          }
        })
        .catch(() => navigate('/'));
    } else {
      fetchProduct();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black flex items-center justify-center text-white">
        Loading 3D viewer...
      </div>
    );
  }

  if (!product?.model3D) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black flex items-center justify-center text-white">
        3D model not available for this product
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-zinc-900 flex text-white">
      {/* 3D Viewer Section */}
      <div className="w-1/2 h-full relative border-r-2 border-zinc-800 p-6">
        <Canvas camera={{ position: [0, 2, 5], fov: 50, near: 0.1, far: 1000 }}>
          <Suspense fallback={
            <Html center>
              <div className="text-white text-2xl">Loading masterpiece...</div>
            </Html>
          }>
            {/* Scene Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={1.5}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            
            {/* Floating Particles */}
            <Sparkles
              count={150}
              size={4}
              speed={0.4}
              opacity={0.8}
              color="#ef4444"
              scale={20}
              noise={0.8}
              position={[0, 0, 0]}
              depth={10}
              fade={false}
              spawnRate={0.5}
            />

            {/* Main Model Display */}
            <Stage environment="dawn" intensity={0.5} adjustCamera={false}>
              {product?.model3D && (
                <>
                  <Model 
                    modelPath={`http://localhost:3000/public/uploads/3dmodels/${product.model3D}`}
                    scale={0.8}
                    position={[0, -12, 222]}
                  />
                  <ContactShadows
                    frames={0}
                    position={[0, 0, 0]}
                    opacity={0.4}
                    scale={10}
                    blur={2.5}
                    far={1}
                  />
                </>
              )}
            </Stage>

            {/* Floor Reflection
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
              <circleGeometry args={[5, 64]} />
              <meshStandardMaterial
                color="#1a1a1a"
                metalness={0.5}
                roughness={0.3}
                transparent
                opacity={0.5}
              />
            </mesh> */}

            {/* Camera Controls */}
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate={autoRotate}
              autoRotateSpeed={2}
              maxDistance={10}
              minDistance={4}
              minPolarAngle={Math.PI/6}
              maxPolarAngle={Math.PI/2}
              target={[0, 0.5, 0]}
              dampingFactor={0.1}
              onChange={() => setAutoRotate(false)}
            />

            {/* Environment Effects */}
            <Environment preset="sunset" background blur={0.5} />
          </Suspense>
        </Canvas>
      </div>

      {/* Product Details Section */}
      <div className="w-1/2 h-full overflow-y-auto bg-gradient-to-br from-zinc-900 to-zinc-950 p-12 ">
        {product && (
          <div className="space-y-8">
            {/* Header with Gradient Text */}
            <div className="border-b border-zinc-800 pb-8 relative">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-red-500/10 to-transparent opacity-20 -z-10" />
              <button
                onClick={() => navigate(-1)}
                className="mb-6 mt-12 group flex items-center gap-2 text-zinc-400 hover:text-white transition-all"
              >
                <i className="fas fa-arrow-left transition-transform group-hover:-translate-x-1"></i>
                Back to Product
              </button>
              <h1 className="text-5xl font-bold pb-2 mb-4 bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
                {product.name}
              </h1>
              <p className="text-xl text-zinc-400 font-light">{product.shortDescription}</p>
            </div>

            {/* Premium Badge */}
            <div className="flex gap-2 items-center bg-zinc-800/50 p-4 rounded-xl border border-red-500/30">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <i className="fas fa-crown text-red-500"></i>
              </div>
              <div>
                <h3 className="font-bold">Premium Collection</h3>
                <p className="text-sm text-zinc-400">Certified Limited Edition</p>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="relative bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-red-500/50 transition-all group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
                      ${product.price}
                    </span>
                    {product.oldPrice && (
                      <span className="text-zinc-400 line-through">${product.oldPrice}</span>
                    )}
                  </div>
                  <p className="text-zinc-400 text-sm">Including VAT & Shipping</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-500">{product.stock} in stock</span>
                </div>
              </div>
              <button className="w-full mt-6 py-4 bg-red-500 hover:bg-red-600 rounded-xl transition-all 
                flex items-center justify-center gap-3 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                <i className="fas fa-shopping-cart"></i>
                Add to Collection
              </button>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: 'ruler', label: 'Scale', value: product.scale },
                { icon: 'cube', label: 'Material', value: product.material },
                { icon: 'expand', label: 'Dimensions', value: product.dimensions },
                { icon: 'weight-hanging', label: 'Weight', value: product.weight },
              ].map((spec, index) => (
                <div key={index} className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-red-500/30 transition-all text-white">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <i className={`fas fa-${spec.icon} text-red-500`}></i>
                    </div>
                    <h3 className="font-bold">{spec.label}</h3>
                  </div>
                  <p className="text-2xl font-medium">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Feature Showcase */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Masterpiece Features</h2>
              <div className="grid gap-6">
                {product.features?.map((feature, index) => (
                  <div key={index} className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-red-500/30 transition-all text-white">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-red-500/20 rounded-lg mt-1">
                        <i className="fas fa-check text-red-500"></i>
                      </div>
                      <p className="text-lg text-white/90">{feature}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery Slider */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Gallery</h2>
              <div className="grid grid-cols-3 gap-4">
                {product.images?.map((image, index) => (
                  <div key={index} className="aspect-square bg-zinc-800 rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                    <img 
                      src={image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Story Section */}
            <div className="space-y-6 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl -z-10"></div>
              <h2 className="text-3xl font-bold">The Story</h2>
              <p className="text-white/80 text-lg leading-relaxed">
                {product.description}
              </p>
              <div className="flex gap-4 mt-6">
                <button className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-all">
                  <i className="fab fa-youtube"></i>
                  Watch Film
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-all">
                  <i className="fas fa-book-open"></i>
                  Read History
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameView;
