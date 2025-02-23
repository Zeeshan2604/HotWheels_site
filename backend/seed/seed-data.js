import mongoose from 'mongoose';
import { Category } from '../models/collection.js';
import { Product } from '../models/product.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const collections = [
  {
    name: "Sports Cars",
    slug: "sports-cars",
    description: "High-performance sports cars from legendary manufacturers",
    image: "http://localhost:3000/hotwheels/Sports_car.jpg",
    tags: ["Speed", "Performance", "Luxury"]
  },
  {
    name: "Off-Road",
    slug: "off-road",
    description: "Rugged vehicles built for adventure and tough terrain",
    image: "http://localhost:3000/hotwheels/Off_road.jpg",
    tags: ["Adventure", "4x4", "Terrain"]
  },
  {
    name: "Classics",
    slug: "classics",
    description: "Timeless vintage cars that defined automotive history",
    image: "http://localhost:3000/hotwheels/Classics.jpg",
    tags: ["Vintage", "History", "Collectible"]
  },
  {
    name: "Limited Edition",
    slug: "limited-edition",
    description: "Rare and exclusive models for serious collectors",
    image: "http://localhost:3000/hotwheels/Limited_edition.jpg",
    tags: ["Rare", "Exclusive", "Premium"]
  },
  {
    name: "Movie Cars",
    slug: "movie-cars",
    description: "Iconic vehicles from famous movies and TV shows",
    image: "http://localhost:3000/hotwheels/Movie_cars.jpg",
    tags: ["Entertainment", "Cinema", "Famous"]
  },
  {
    name: "Racing Legends",
    slug: "racing-legends",
    description: "Championship-winning race cars from different eras",
    image: "http://localhost:3000/hotwheels/H1.jpg",
    tags: ["Motorsport", "Competition", "Speed"]
  },
  {
    name: "Muscle Cars",
    slug: "muscle-cars",
    description: "Powerful American muscle cars from the golden era",
    image: "http://localhost:3000/hotwheels/Muscle_car.jpg",
    tags: ["Power", "American", "Classic"]
  },
  {
    name: "JDM Tuners",
    slug: "jdm-tuners",
    description: "Japanese performance cars and tuner specials",
    image: "http://localhost:3000/hotwheels/JDM_tuners.jpg",
    tags: ["Japanese", "Tuner", "Performance"]
  }
];

const products = [
  // Sports Cars
  {
    name: "Porsche 911 GT3 RS",
    description: "Track-focused version of the iconic 911, featuring advanced aerodynamics and precision engineering",
    price: 19.99,
    countInStock: 15,
    isFeatured: true,
    collectionName: "Sports Cars",
    image: "http://localhost:3000/hotwheels/p1.webp",
    images: [
      "http://localhost:3000/hotwheels/p1.webp",
      "http://localhost:3000/hotwheels/p2.jpg",
      "http://localhost:3000/hotwheels/p3.jpg"
    ],
    tags: ["Porsche", "Track", "Performance"]
  },
  {
    name: "Ferrari F8 Tributo",
    description: "The most powerful V8 Ferrari ever made, combining performance with Italian elegance",
    price: 22.99,
    countInStock: 10,
    isFeatured: true,
    collectionName: "Sports Cars",
    image: "http://localhost:3000/hotwheels/f1.jpg",
    images: [
      "http://localhost:3000/hotwheels/f1.jpg",
      "http://localhost:3000/hotwheels/f2.jpg",
      "http://localhost:3000/hotwheels/f3.jpg",
      "http://localhost:3000/hotwheels/f4.jpg"
    ],
    tags: ["Ferrari", "V8", "Italian"]
  },

  // Off-Road
  {
    name: "Land Rover Defender",
    description: "The ultimate all-terrain vehicle, ready for any adventure",
    price: 18.99,
    countInStock: 20,
    collectionName: "Off-Road",
    image: "http://localhost:3000/hotwheels/l1.jpg",
    images: [
      "http://localhost:3000/hotwheels/l1.jpg",
      "http://localhost:3000/hotwheels/l2.jpg",
      "http://localhost:3000/hotwheels/l3.jpg",
      "http://localhost:3000/hotwheels/l4.jpg"
    ],
    tags: ["British", "4x4", "Adventure"]
  },

  // Continue with more products...
  {
    name: "Ford Bronco",
    description: "Classic American off-roader with modern capabilities",
    price: 19.99,
    countInStock: 25,
    collectionName: "Off-Road",
    image: "http://localhost:3000/hotwheels/fb1.jpg",
    images: [
      "http://localhost:3000/hotwheels/fb1.jpg",
      "http://localhost:3000/hotwheels/fb2.jpg",
      "http://localhost:3000/hotwheels/fb3.jpg"
    ],
    tags: ["American", "4x4", "Classic"]
  },

  // Classics
  {
    name: "Mercedes-Benz 300SL",
    description: "The iconic Gullwing, a true masterpiece of automotive history",
    price: 21.99,
    countInStock: 5,
    collectionName: "Classics",
    image: "http://localhost:3000/hotwheels/m1.jpg",
    images: [
      "http://localhost:3000/hotwheels/m1.jpg",
      "http://localhost:3000/hotwheels/m2.jpg",
      "http://localhost:3000/hotwheels/m3.jpg"
    ],
    tags: ["German", "Vintage", "Luxury"]
  },

  // Limited Edition
  {
    name: "Bugatti Chiron Pur Sport",
    description: "Ultra-exclusive hypercar with unmatched performance",
    price: 27.99,
    countInStock: 3,
    collectionName: "Limited Edition",
    image: "http://localhost:3000/hotwheels/bg1.jpg",
    images: [
      "http://localhost:3000/hotwheels/bg1.jpg",
      "http://localhost:3000/hotwheels/bg2.jpg",
      "http://localhost:3000/hotwheels/bg3.jpg",
      "http://localhost:3000/hotwheels/bg4.jpg"
    ],
    tags: ["Hypercar", "Limited", "Exclusive"]
  },

  // Movie Cars
  {
    name: "Aston Martin DB5",
    description: "The most famous car in cinema history, as seen in James Bond",
    price: 24.99,
    countInStock: 7,
    collectionName: "Movie Cars",
    image: "http://localhost:3000/hotwheels/a1.jpg",
    images: [
      "http://localhost:3000/hotwheels/a1.jpg",
      "http://localhost:3000/hotwheels/a2.jpg",
      "http://localhost:3000/hotwheels/a3.jpg",
      "http://localhost:3000/hotwheels/a4.jpg"
    ],
    tags: ["British", "Cinema", "Spy"]
  },

  // Racing Legends
  {
    name: "McLaren F1 GTR",
    description: "Legendary race car that dominated the 24 Hours of Le Mans",
    price: 24.99,
    countInStock: 6,
    collectionName: "Racing Legends",
    image: "http://localhost:3000/hotwheels/mk.jpg",
    images: [
      "http://localhost:3000/hotwheels/mk.jpg",
      "http://localhost:3000/hotwheels/mk1.jpg",
      "http://localhost:3000/hotwheels/mk2.jpg"
    ],
    tags: ["McLaren", "Le Mans", "Race Car"]
  },

  // Muscle Cars
  {
    name: "1969 Dodge Charger",
    description: "American muscle at its finest, pure power and presence",
    price: 17.99,
    countInStock: 12,
    collectionName: "Muscle Cars",
    image: "http://localhost:3000/hotwheels/d1.jpg",
    images: [
      "http://localhost:3000/hotwheels/d1.jpg",
      "http://localhost:3000/hotwheels/d2.jpg",
      "http://localhost:3000/hotwheels/d3.jpg"
    ],
    tags: ["American", "V8", "Classic"]
  },

  // JDM Tuners
  {
    name: "Nissan Skyline GT-R R34",
    description: "The ultimate JDM icon, Godzilla itself",
    price: 21.99,
    countInStock: 15,
    collectionName: "JDM Tuners",
    image: "http://localhost:3000/hotwheels/n1.jpg",
    images: [
      "http://localhost:3000/hotwheels/n1.jpg",
      "http://localhost:3000/hotwheels/n2.jpg",
      "http://localhost:3000/hotwheels/n3.jpg"
    ],
    tags: ["Japanese", "Turbo", "Legend"]
  }
];

// Add more products for each collection...

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log('Connected to database');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Insert collections
    const savedCollections = await Category.insertMany(collections);
    console.log('Collections added');

    // Create products with references to collections
    const productsWithCategories = products.map(product => {
      const collection = savedCollections.find(c => 
        c.name === product.collectionName
      );
      return {
        ...product,
        category: collection._id
      };
    });

    await Product.insertMany(productsWithCategories);
    console.log('Products added');

    // Update model3D fields
    const modelMappings = [
      { name: "1969 Dodge Charger", model: "1969_dodge_charger.glb" },
      { name: "Aston Martin DB5", model: "aston_martin.glb" },
      { name: "Ford Bronco", model: "bronco_2021_bl.glb" },
      { name: "Bugatti Chiron Pur Sport", model: "bugatti_chiron_pur_sport.glb" },
      { name: "Land Rover Defender", model: "land_rover_defender.glb" },
      { name: "McLaren F1 GTR", model: "mclaren_f1_gtr.glb" },
      { name: "Mercedes-Benz 300SL", model: "mercedes-benz_300.glb" },
      { name: "Porsche 911 GT3 RS", model: "porsche_911_gt3_rs.glb" },
      { name: "Ferrari F8 Tributo", model: "ferrari_f8_tributo.glb" },
      { name: "Nissan Skyline GT-R R34", model: "nissan-skyline-r34-gtr.glb" },
    ];

    for (const mapping of modelMappings) {
      await Product.updateOne(
        { name: mapping.name },
        { $set: { model3D: mapping.model } }
      );
    }

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 