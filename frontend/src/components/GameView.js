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
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import Footer from './Footer';
import { API_URL } from "../utils/getApiUrl";

function Model({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  
  useEffect(() => {
    if (scene) {
      // Reset position and scale
      scene.position.set(0, 0, 0);
      scene.scale.set(1, 1, 1);
      scene.rotation.set(0, 0, 0);
      
      // Make sure all materials are visible
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

// Preload the model
useGLTF.preload(`/uploads/3dmodels/ferrari_f8_tributo.glb`);

const GameView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showList, setShowList] = useState(!id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleAddToCart = async () => {
    const result = await addToCart(product);
    if (!result.success) {
      navigate('/login'); // Redirect to login if not logged in
    } else {
      setToastMessage(result.message); // Show success message
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  // Generate car history based on car name
  const getCarHistory = (carName) => {
    const histories = {
      "Ferrari F8 Tributo": {
        title: "The Ferrari F8 Tributo - A Tribute to Excellence",
        content: [
          "The Ferrari F8 Tributo, introduced in 2019, represents the pinnacle of Ferrari's mid-engine V8 sports car evolution. This masterpiece was designed as a tribute to the most powerful non-special series V8 engine ever produced by the legendary Italian marque.",
          "The F8 Tributo's heart beats with a 3.9-liter twin-turbocharged V8 engine, producing an astonishing 710 horsepower and 568 lb-ft of torque. This powerplant is a direct evolution of the 488's engine, but with significant improvements in efficiency and performance.",
          "What makes the F8 Tributo truly special is its perfect balance of power and handling. The car features Ferrari's most advanced aerodynamics package, including the innovative S-Duct at the front and a rear spoiler that generates 25% more downforce than its predecessor while reducing drag by 10%.",
          "The F8 Tributo's design pays homage to Ferrari's rich racing heritage, with styling cues inspired by the iconic F40 and F50. Every curve and line serves both form and function, creating a car that's as beautiful as it is capable. The car can accelerate from 0-60 mph in just 2.9 seconds and reach a top speed of 211 mph.",
          "This model represents the culmination of decades of Ferrari's engineering expertise, combining cutting-edge technology with the raw emotion that only a Ferrari can deliver. It's not just a car; it's a celebration of automotive passion and Italian craftsmanship at its finest."
        ]
      },
      "Bugatti Chiron Pur Sport": {
        title: "The Bugatti Chiron Pur Sport - Pure Performance Redefined",
        content: [
          "The Bugatti Chiron Pur Sport, unveiled in 2020, represents the most dynamic and agile version of the legendary Chiron. This extraordinary machine was designed for drivers who demand the ultimate in precision handling and track performance, while maintaining the incredible power that Bugatti is renowned for.",
          "At its heart lies the iconic 8.0-liter quad-turbocharged W16 engine, producing a mind-bending 1,500 horsepower. However, the Pur Sport isn't just about raw power—it's about delivering that power with surgical precision. The engine has been tuned for higher revs, with the redline increased to 6,900 rpm, creating a more engaging driving experience.",
          "The Pur Sport's aerodynamics have been completely reimagined for maximum downforce and minimal drag. The massive rear wing, inspired by Formula 1 technology, can generate up to 1,900 pounds of downforce, while the front splitter and diffuser work in harmony to create a car that sticks to the road like glue.",
          "What truly sets the Pur Sport apart is its weight reduction program. Through extensive use of carbon fiber and titanium, Bugatti managed to shed 110 pounds compared to the standard Chiron. Every component has been optimized for performance, from the lightweight magnesium wheels to the titanium exhaust system.",
          "The Chiron Pur Sport represents the perfect balance between luxury and performance. It's a car that can dominate any racetrack while providing the comfort and refinement expected from a Bugatti. This is automotive engineering at its absolute finest—a true masterpiece of speed, precision, and elegance."
        ]
      },
      "McLaren F1 GTR": {
        title: "The McLaren F1 GTR - Racing Legend Reborn",
        content: [
          "The McLaren F1 GTR, introduced in 1995, is one of the most successful and iconic racing cars ever created. Born from the legendary road-going McLaren F1, the GTR version was developed to dominate the world's most prestigious endurance races, including the 24 Hours of Le Mans.",
          "The F1 GTR's heart is the same BMW-sourced 6.1-liter V12 engine that powered the road car, but tuned for racing with reduced displacement to 6.0 liters to meet GT1 regulations. Despite the reduction, the engine still produced an impressive 600 horsepower, propelling the lightweight carbon fiber chassis to incredible speeds.",
          "The 1995 Le Mans victory is perhaps the most famous chapter in the F1 GTR's story. Against all odds, the McLaren F1 GTRs finished 1st, 3rd, 4th, and 5th, defeating purpose-built prototypes from manufacturers like Porsche, Mercedes-Benz, and Toyota. This victory proved that a road car could be successfully converted into a world-beating race car.",
          "The F1 GTR's success wasn't limited to Le Mans. It dominated GT racing around the world, winning championships in Japan, Europe, and the United States. The car's combination of lightweight construction, aerodynamic efficiency, and reliable performance made it nearly unbeatable in its class.",
          "Today, the McLaren F1 GTR is considered one of the most valuable and collectible racing cars ever made. Only 28 examples were built, making it extremely rare. The car represents the pinnacle of 1990s racing technology and continues to inspire automotive enthusiasts and engineers worldwide."
        ]
      },
      "Porsche 911 GT3 RS": {
        title: "The Porsche 911 GT3 RS - Track-Focused Perfection",
        content: [
          "The Porsche 911 GT3 RS represents the ultimate expression of Porsche's racing heritage in a road-legal package. This track-focused variant of the iconic 911 has been refined over generations to deliver the purest driving experience possible, combining cutting-edge technology with decades of racing expertise.",
          "The GT3 RS is powered by a naturally aspirated 4.0-liter flat-6 engine, producing 518 horsepower and 465 lb-ft of torque. This high-revving masterpiece can reach 9,000 rpm, creating an intoxicating soundtrack that's become synonymous with Porsche's racing DNA. The engine's linear power delivery and immediate throttle response make it a joy to drive at any speed.",
          "Aerodynamics play a crucial role in the GT3 RS's performance. The massive rear wing, front splitter, and underbody diffuser work together to generate significant downforce, allowing the car to corner at speeds that would be impossible for most road cars. The active aerodynamics system automatically adjusts the wing angle based on speed and driving conditions.",
          "The GT3 RS's chassis has been extensively modified for track use, featuring stiffer suspension, larger brakes, and wider wheels than the standard 911. The car's weight distribution and center of gravity have been optimized for maximum agility and stability, making it one of the most capable track cars available.",
          "What makes the GT3 RS truly special is its ability to deliver race car performance while remaining comfortable enough for daily use. It's a car that can dominate a track day in the morning and cruise home in comfort in the afternoon. This duality is what makes the GT3 RS not just a great sports car, but one of the greatest cars ever made."
        ]
      },
      "Nissan Skyline R34 GT-R": {
        title: "The Nissan Skyline R34 GT-R - Godzilla's Golden Era",
        content: [
          "The Nissan Skyline R34 GT-R, affectionately known as 'Godzilla,' represents the pinnacle of Japanese sports car engineering in the 1990s. This legendary machine combined cutting-edge technology with raw performance to create a car that could compete with and often defeat much more expensive European supercars.",
          "At the heart of the R34 GT-R lies the legendary RB26DETT engine—a 2.6-liter twin-turbocharged inline-6 that produced 276 horsepower in stock form (though many believe the actual output was significantly higher). This engine became famous for its incredible reliability and massive tuning potential, with modified examples producing well over 1,000 horsepower.",
          "The R34 GT-R's most revolutionary feature was its ATTESA E-TS Pro all-wheel-drive system, which could distribute power between the front and rear axles in milliseconds. Combined with the Super HICAS four-wheel steering system, the GT-R could corner with precision that seemed impossible for a car of its size and weight.",
          "The R34 GT-R's success in motorsport is legendary. It dominated Japanese touring car racing, winning multiple championships and earning the nickname 'Godzilla' for its ability to destroy the competition. The car's success wasn't limited to Japan—it also competed successfully in Australian touring car racing and various other international series.",
          "Today, the R34 GT-R is one of the most sought-after Japanese sports cars ever made. Its combination of performance, technology, and cultural significance has made it a true icon of the automotive world. The car represents a golden era of Japanese automotive engineering and continues to inspire enthusiasts and tuners worldwide."
        ]
      },
      "Aston Martin DB11": {
        title: "The Aston Martin DB11 - British Elegance Meets Modern Performance",
        content: [
          "The Aston Martin DB11, introduced in 2016, represents a new era for the legendary British marque. This grand tourer combines the timeless elegance that Aston Martin is famous for with cutting-edge technology and performance that can compete with the world's finest sports cars.",
          "The DB11 is powered by a choice of two exceptional engines: a 4.0-liter twin-turbocharged V8 sourced from Mercedes-AMG, producing 503 horsepower, or a 5.2-liter twin-turbocharged V12, producing 630 horsepower. Both engines deliver the smooth, refined power delivery that's expected from an Aston Martin, while providing the performance to match the car's stunning looks.",
          "The DB11's design is a masterclass in automotive styling. Every line and curve has been carefully crafted to create a car that's both beautiful and aerodynamically efficient. The innovative Aeroblade system, which channels air through the rear deck to create downforce without the need for a visible spoiler, is a perfect example of form following function.",
          "Inside, the DB11 offers a level of luxury and craftsmanship that's unmatched in its class. The hand-stitched leather, metal accents, and attention to detail create an environment that's both comfortable and inspiring. The car's technology has been carefully integrated to enhance the driving experience without overwhelming the traditional Aston Martin aesthetic.",
          "The DB11 represents the perfect balance between tradition and innovation. It's a car that honors Aston Martin's rich heritage while embracing the future. Whether cruising along the French Riviera or attacking a mountain pass, the DB11 delivers an experience that's uniquely Aston Martin—sophisticated, powerful, and utterly captivating."
        ]
      },
      "Land Rover Defender": {
        title: "The Land Rover Defender - Icon of Adventure",
        content: [
          "The Land Rover Defender, first introduced in 1983, is one of the most iconic and capable off-road vehicles ever created. This legendary machine has conquered some of the world's most challenging terrain, from the deserts of Africa to the mountains of the Himalayas, earning a reputation for unmatched durability and capability.",
          "The Defender's design is a masterclass in functional engineering. Its boxy shape, high ground clearance, and short overhangs allow it to tackle obstacles that would stop most other vehicles. The ladder-frame chassis and solid axles provide the strength and articulation needed for serious off-road work, while the permanent four-wheel-drive system ensures traction in any conditions.",
          "Over its 67-year production run, the Defender has been used by farmers, explorers, military forces, and adventurers around the world. It has crossed continents, climbed mountains, and traversed deserts, proving its reliability in the harshest environments imaginable. The Defender's simple, robust design means it can be repaired with basic tools in remote locations.",
          "The Defender's versatility is legendary. It has been used as a fire truck, ambulance, military vehicle, and even a mobile workshop. The modular design allows for countless configurations, from basic utility vehicles to luxurious expedition vehicles. This adaptability has made the Defender a favorite among overland travelers and adventure seekers.",
          "Today, the Defender continues to inspire a new generation of adventurers. While the original model ceased production in 2016, its spirit lives on in the new Defender, which combines the original's capability with modern technology and comfort. The Defender represents more than just a vehicle—it's a symbol of adventure, exploration, and the human spirit's desire to go beyond the beaten path."
        ]
      },
      "Mercedes-Benz 300SL": {
        title: "The Mercedes-Benz 300SL - The Original Supercar",
        content: [
          "The Mercedes-Benz 300SL, introduced in 1954, is widely considered the world's first supercar. This revolutionary machine combined advanced technology, stunning design, and incredible performance to create a car that was decades ahead of its time. The 300SL's influence can still be seen in modern sports cars today.",
          "The 300SL's most iconic feature is its 'Gullwing' doors, which open upward like the wings of a seagull. These doors were not just a styling exercise—they were a necessity due to the car's tubular space frame chassis, which had high sills for structural rigidity. The doors became the car's defining characteristic and one of the most recognizable features in automotive history.",
          "Under the hood lies a 3.0-liter inline-6 engine with mechanical fuel injection, a technology that was revolutionary in the 1950s. The engine produced 215 horsepower, which was extraordinary for the time, allowing the 300SL to reach a top speed of 160 mph. The car's aerodynamic design, with its low drag coefficient, helped achieve these impressive performance figures.",
          "The 300SL's racing pedigree is legendary. It dominated sports car racing in the 1950s, winning the 24 Hours of Le Mans in 1952 and the Carrera Panamericana in 1952 and 1953. The car's success on the track helped establish Mercedes-Benz as a manufacturer of world-class sports cars and laid the foundation for the brand's future racing achievements.",
          "Today, the 300SL is one of the most valuable and collectible cars in the world. Its combination of historical significance, technological innovation, and timeless design has made it a true automotive icon. The 300SL represents the beginning of the supercar era and continues to inspire automotive enthusiasts and designers worldwide."
        ]
      },
      "Ford Mustang": {
        title: "The Ford Mustang - America's Pony Car Legend",
        content: [
          "The Ford Mustang, introduced in 1964, is one of the most influential and beloved cars in automotive history. This iconic machine created the 'pony car' segment and became a symbol of American freedom, power, and style. The Mustang's impact on automotive culture cannot be overstated—it changed the way Americans thought about cars.",
          "The original Mustang was an instant success, selling over 22,000 units on its first day of availability. The car's combination of sporty styling, affordable price, and available performance options made it accessible to a wide range of buyers. The Mustang's long hood, short deck design became the template for countless sports cars that followed.",
          "Over the decades, the Mustang has evolved while staying true to its core values. From the powerful Shelby GT350 and GT500 models of the 1960s to the modern GT and Mach 1 variants, the Mustang has always offered performance that exceeds its price point. The car's V8 engine options have become legendary, producing the distinctive sound that's synonymous with American muscle.",
          "The Mustang's cultural impact extends far beyond the automotive world. It has appeared in countless movies, songs, and works of art, becoming a symbol of American culture itself. The car represents freedom, rebellion, and the open road—values that resonate with people around the world.",
          "Today, the Mustang continues to evolve with the times while maintaining its essential character. The latest models offer modern technology and performance while preserving the car's iconic styling and driving dynamics. The Mustang remains one of the most popular sports cars in the world, proving that great design and performance never go out of style."
        ]
      },
      "Dodge Charger": {
        title: "The Dodge Charger - American Muscle Icon",
        content: [
          "The Dodge Charger, first introduced in 1966, is one of the most iconic American muscle cars ever created. This powerful machine has become synonymous with raw power, aggressive styling, and the golden age of American automotive performance. The Charger's influence on car culture and popular media is unmatched.",
          "The second-generation Charger, introduced in 1968, is perhaps the most famous iteration of the car. Its distinctive 'Coke bottle' styling, hidden headlights, and powerful engine options made it an instant classic. The Charger R/T (Road/Track) models featured the legendary 440 Magnum and 426 Hemi engines, producing power that was unheard of in street cars of the era.",
          "The Charger's fame was cemented by its appearance in the 1968 film 'Bullitt,' where it starred alongside Steve McQueen in one of the most famous car chase scenes in cinema history. The car's aggressive styling and powerful performance made it the perfect choice for the role of the villain's car, and the chase scene helped establish the Charger as a cultural icon.",
          "Throughout the 1970s and 1980s, the Charger evolved with the times, adapting to changing regulations and market demands. The car's performance heritage was maintained through various high-performance variants, including the Charger Daytona and Super Bee models. These cars continued to offer the power and style that made the Charger famous.",
          "Today, the modern Charger continues the legacy of its predecessors. The current model offers a range of powerful engines, including the supercharged 6.2-liter Hemi V8 in the Charger Hellcat, which produces an astonishing 717 horsepower. The car's aggressive styling and powerful performance ensure that the Charger remains one of the most exciting cars on the road."
        ]
      }
    };

    // Try to find an exact match first
    if (histories[carName]) {
      return histories[carName];
    }

    // If no exact match, try to find a partial match
    const carNameLower = carName.toLowerCase();
    for (const [key, value] of Object.entries(histories)) {
      if (carNameLower.includes(key.toLowerCase().split(' ')[0]) || 
          key.toLowerCase().includes(carNameLower.split(' ')[0])) {
        return value;
      }
    }

    // Default history for unknown cars
    return {
      title: `${carName} - A Legendary Machine`,
      content: [
        `The ${carName} represents the pinnacle of automotive engineering and design. This extraordinary machine combines cutting-edge technology with timeless styling to create a driving experience that's truly unforgettable.`,
        `Every aspect of the ${carName} has been carefully crafted to deliver maximum performance and driving pleasure. From its powerful engine to its precision-tuned chassis, this car represents the perfect balance of power and control.`,
        `The ${carName}'s design is a masterclass in automotive aesthetics. Every line and curve serves both form and function, creating a car that's as beautiful as it is capable. The attention to detail is evident in every component, from the hand-stitched interior to the precision-engineered mechanical systems.`,
        `This model has earned its place among the automotive elite through its combination of performance, reliability, and driving dynamics. It's a car that can dominate on the track while providing the comfort and refinement needed for everyday use.`,
        `The ${carName} represents more than just transportation—it's a symbol of passion, innovation, and the relentless pursuit of automotive perfection. This is a car that will be remembered and celebrated for generations to come.`
      ]
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id && id !== 'list') {
          // Fetch specific product for 3D view
          const response = await axios.get(`${API_URL}/api/v1/products/${id}`);
          setProduct(response.data);
          setShowList(false);
        } else {
          // Fetch all products with 3D models for list view
          const response = await axios.get(`${API_URL}/api/v1/products`);
          const productsWith3D = response.data.filter(p => p.model3D);
          setProducts(productsWith3D);
          setShowList(true);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        navigate('/');
      }
    };
    
    if(id === 'random') {
      // Fetch random product with 3D model
      axios.get(`${API_URL}/api/v1/products?has3DModel=true`)
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
      fetchData();
    }
  }, [id, navigate]);

  // 3D List View Component
  const GameListView = () => (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white pt-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* 3D Models Grid */}
      <section className="py-8 md:py-12 relative z-10">
        <div className="container mx-auto px-4">
          {loading ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto mb-6"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-orange-500 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
              </div>
              <p className="text-gray-400 text-base md:text-lg">Loading premium 3D models...</p>
            </motion.div>
          ) : products.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-6xl md:text-8xl mb-8 animate-bounce">🚗</div>
              <h3 className="text-2xl md:text-3xl text-white mb-4 font-bold">No 3D Models Available</h3>
              <p className="text-gray-400 mb-8 text-base md:text-lg">Check back later for premium 3D models</p>
              <button
                onClick={() => navigate('/products')}
                className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full transition-all font-bold text-base md:text-lg shadow-lg hover:shadow-red-500/25"
              >
                Browse Products
              </button>
            </motion.div>
          ) : (
            <>
              <motion.div 
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div>
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
                    Available 3D Models
                  </h2>
                  <p className="text-gray-400 text-base md:text-lg">
                    {products.length} premium models ready for exploration
                  </p>
                </div>
                <button
                  onClick={() => navigate('/products')}
                  className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 rounded-full transition-all font-bold text-base md:text-lg border border-zinc-600/50"
                >
                  View All Products
                </button>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/game/${product._id}`)}
                  >
                    <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl overflow-hidden border border-zinc-700/50 hover:border-red-500/50 transition-all duration-300 shadow-xl hover:shadow-[0_20px_40px_rgba(239,68,68,0.2)]">
                      {/* 3D Preview */}
                      <div className="aspect-square relative bg-gradient-to-br from-zinc-800 to-zinc-900">
                        <Canvas
                          camera={{ 
                            position: [5, 2, 5],
                            fov: 50,
                            near: 0.1,
                            far: 1000
                          }}
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
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-black via-zinc-950 to-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-16 md:w-20 h-16 md:h-20 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 md:w-20 h-16 md:h-20 border-4 border-transparent border-t-orange-500 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <h2 className="text-xl md:text-2xl font-bold mb-2">Loading 3D Viewer</h2>
          <p className="text-gray-400 text-sm md:text-base">Preparing your premium experience...</p>
        </div>
      </div>
    );
  }

  // Show list view if no specific product or if explicitly requested
  if (showList) {
    return <GameListView />;
  }

  if (!product?.model3D) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white pt-20">
        <div className="container mx-auto px-4 text-center py-20">
          <motion.div 
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-6xl md:text-8xl mb-8 animate-bounce">🚗</div>
            <h2 className="text-2xl md:text-3xl text-red-500 mb-4 font-bold">3D Model Not Available</h2>
            <p className="text-gray-400 mb-8 text-base md:text-lg">This product doesn't have a 3D model yet.</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate(-1)}
                className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 rounded-full transition-all font-bold text-base md:text-lg"
              >
                Go Back
              </button>
              <button 
                onClick={() => navigate('/game/list')}
                className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full transition-all font-bold text-base md:text-lg shadow-lg hover:shadow-red-500/25"
              >
                View All 3D Models
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white pt-20">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.05),transparent_50%)]"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <motion.button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-all bg-zinc-900/80 hover:bg-zinc-800/80 px-4 py-2 rounded-lg backdrop-blur-md border border-zinc-700/50 text-sm"
              whileHover={{ x: -5 }}
            >
              <i className="fas fa-arrow-left transition-transform group-hover:-translate-x-1"></i>
              Back to Product
            </motion.button>

          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {product.name}
          </h1>
          <p className="text-zinc-400 text-sm md:text-base">
            Interactive 3D Experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3D Viewer Section */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
          <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 rounded-2xl border border-zinc-700/50 backdrop-blur-md overflow-hidden">
            <div className="aspect-square relative">
              {/* 3D View Controls */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
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
                    {product?.model3D && (
                      <Model 
                        modelPath={`/uploads/3dmodels/${product.model3D}`}
                      />
                    )}

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
            </div>
          </motion.div>

          {/* Product Details Section */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Product Info Card */}
            <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 rounded-2xl p-6 border border-zinc-700/50 backdrop-blur-md">
              {product.isFeatured && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-crown text-white text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Premium Collection</h3>
                    <p className="text-xs text-zinc-400">Limited Edition</p>
                  </div>
                </div>
              )}
              
              <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                    ${product.price}
                  </span>
                  {product.oldPrice && (
                    <span className="text-zinc-400 line-through text-sm ml-2">${product.oldPrice}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-medium">{product.countInStock} in stock</span>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button 
              onClick={handleAddToCart}
              className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all 
                flex items-center justify-center gap-3 font-semibold text-white shadow-lg hover:shadow-red-500/25"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fas fa-shopping-cart text-sm"></i>
              Add to Cart
            </motion.button>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: 'ruler', label: 'Scale', value: product.scale || '1:64' },
                { icon: 'cube', label: 'Material', value: product.material || 'Die-cast metal' },
                { icon: 'expand', label: 'Dimensions', value: product.dimensions || '3" x 1.5"' },
                { icon: 'weight-hanging', label: 'Weight', value: product.weight || '50g' },
              ].map((spec, index) => (
                <motion.div 
                  key={index} 
                  className="p-4 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 rounded-xl border border-zinc-700/50 hover:border-red-500/30 transition-all backdrop-blur-md group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg group-hover:from-red-500/30 group-hover:to-orange-500/30 transition-all">
                      <i className={`fas fa-${spec.icon} text-red-500 text-sm`}></i>
                    </div>
                    <h3 className="font-medium text-sm text-white">{spec.label}</h3>
                  </div>
                  <p className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{spec.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Features */}
            {product.features && (
              <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 rounded-2xl p-6 border border-zinc-700/50 backdrop-blur-md">
                <h3 className="font-semibold text-white mb-4">Key Features</h3>
                <div className="space-y-3">
                  {product.features.map((feature, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <div className="p-1.5 bg-gradient-to-r from-red-500/20 to-green-500/20 rounded-lg mt-0.5">
                        <i className="fas fa-check text-red-500 text-xs"></i>
                      </div>
                      <p className="text-sm text-zinc-300 leading-relaxed">{feature}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {product.images && product.images.length > 0 && (
              <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 rounded-2xl p-6 border border-zinc-700/50 backdrop-blur-md">
                <h3 className="font-semibold text-white mb-4">Gallery</h3>
                <div className="grid grid-cols-3 gap-3">
                  {product.images.slice(0, 6).map((image, index) => (
                    <motion.div 
                      key={index} 
                      className="aspect-square bg-gradient-to-br from-zinc-800 to-zinc-700 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer group border border-zinc-700/50"
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img 
                        src={image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button 
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl transition-all font-semibold text-white shadow-lg hover:shadow-blue-500/25"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <i className="fab fa-youtube text-sm"></i>
                Watch Film
              </motion.button>
              <motion.button 
                onClick={() => setShowHistoryModal(true)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 rounded-xl transition-all font-semibold text-white border border-zinc-600/50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <i className="fas fa-book-open text-sm"></i>
                Read History
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* History Modal */}
      <AnimatePresence>
        {showHistoryModal && product && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowHistoryModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-zinc-700/50 backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-zinc-900 to-zinc-800 p-6 border-b border-zinc-700/50 rounded-t-2xl backdrop-blur-md z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {getCarHistory(product.name).title}
                    </h2>
                    <p className="text-zinc-400 text-sm md:text-base">
                      Discover the fascinating story behind this legendary machine
                    </p>
                  </div>
                  <button
                    onClick={() => setShowHistoryModal(false)}
                    className="p-2 hover:bg-zinc-700/50 rounded-lg transition-colors text-zinc-400 hover:text-white"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {getCarHistory(product.name).content.map((paragraph, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 p-6 rounded-xl border border-zinc-600/30 backdrop-blur-sm"
                  >
                    <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
                      {paragraph}
                    </p>
                  </motion.div>
                ))}

                {/* Car Image */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 p-6 rounded-xl border border-zinc-600/30 backdrop-blur-sm"
                >
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-center text-zinc-400 text-sm mt-4">
                    The legendary {product.name} - A true automotive masterpiece
                  </p>
                </motion.div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gradient-to-r from-zinc-900 to-zinc-800 p-6 border-t border-zinc-700/50 rounded-b-2xl backdrop-blur-md z-10">
                <div className="flex justify-end gap-3">
                  <motion.button
                    onClick={() => setShowHistoryModal(false)}
                    className="px-6 py-3 bg-gradient-to-r from-zinc-700 to-zinc-600 hover:from-zinc-600 hover:to-zinc-500 rounded-xl transition-all font-semibold text-white border border-zinc-600/50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Close
                  </motion.button>
                  <motion.button
                    onClick={handleAddToCart}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all font-semibold text-white shadow-lg hover:shadow-red-500/25"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <i className="fas fa-shopping-cart mr-2"></i>
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Message */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.3 }}
            className="fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full shadow-lg z-50 backdrop-blur-md border border-green-400/50"
          >
            <div className="flex items-center gap-2">
              <i className="fas fa-check-circle"></i>
              <span className="font-medium">{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
};

export default GameView;
