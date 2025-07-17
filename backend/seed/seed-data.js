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
    image: "/hotwheels/Sports_car.webp",
    tags: ["Speed", "Performance", "Luxury"]
  },
  {
    name: "Off-Road",
    slug: "off-road",
    description: "Rugged vehicles built for adventure and tough terrain",
    image: "/hotwheels/Off_road.webp",
    tags: ["Adventure", "4x4", "Terrain"]
  },
  {
    name: "Classics",
    slug: "classics",
    description: "Timeless vintage cars that defined automotive history",
    image: "/hotwheels/Classics.webp",
    tags: ["Vintage", "History", "Collectible"]
  },
  {
    name: "Limited Edition",
    slug: "limited-edition",
    description: "Rare and exclusive models for serious collectors",
    image: "/hotwheels/Limited_edition.webp",
    tags: ["Rare", "Exclusive", "Premium"]
  },
  {
    name: "Movie Cars",
    slug: "movie-cars",
    description: "Iconic vehicles from famous movies and TV shows",
    image: "/hotwheels/Movie_cars.webp",
    tags: ["Entertainment", "Cinema", "Famous"]
  },
  {
    name: "Racing Legends",
    slug: "racing-legends",
    description: "Championship-winning race cars from different eras",
    image: "/hotwheels/H1.webp",
    tags: ["Motorsport", "Competition", "Speed"]
  },
  {
    name: "Muscle Cars",
    slug: "muscle-cars",
    description: "Powerful American muscle cars from the golden era",
    image: "/hotwheels/Muscle_car.webp",
    tags: ["Power", "American", "Classic"]
  },
  {
    name: "JDM Tuners",
    slug: "jdm-tuners",
    description: "Japanese performance cars and tuner specials",
    image: "/hotwheels/JDM_tuners.webp",
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
    image: "/hotwheels/p1.webp",
    images: [
      "/hotwheels/p1.webp",
      "/hotwheels/p2.webp",
      "/hotwheels/p3.webp"
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
    image: "/hotwheels/f1.webp",
    images: [
      "/hotwheels/f1.webp",
      "/hotwheels/f2.webp",
      "/hotwheels/f3.webp",
      "/hotwheels/f4.webp"
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
    image: "/hotwheels/l1.webp",
    images: [
      "/hotwheels/l1.webp",
      "/hotwheels/l2.webp",
      "/hotwheels/l3.webp",
      "/hotwheels/l4.webp"
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
    image: "/hotwheels/fb1.webp",
    images: [
      "/hotwheels/fb1.webp",
      "/hotwheels/fb2.webp",
      "/hotwheels/fb3.webp"
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
    image: "/hotwheels/m1.webp",
    images: [
      "/hotwheels/m1.webp",
      "/hotwheels/m2.webp",
      "/hotwheels/m3.webp"
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
    image: "/hotwheels/bg1.webp",
    images: [
      "/hotwheels/bg1.webp",
      "/hotwheels/bg2.webp",
      "/hotwheels/bg3.webp",
      "/hotwheels/bg4.webp"
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
    image: "/hotwheels/a1.webp",
    images: [
      "/hotwheels/a1.webp",
      "/hotwheels/a2.webp",
      "/hotwheels/a3.webp",
      "/hotwheels/a4.webp"
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
    image: "/hotwheels/mk.webp",
    images: [
      "/hotwheels/mk.webp",
      "/hotwheels/mk1.webp",
      "/hotwheels/mk2.webp"
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
    image: "/hotwheels/d1.webp",
    images: [
      "/hotwheels/d1.webp",
      "/hotwheels/d2.webp",
      "/hotwheels/d3.webp"
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
    image: "/hotwheels/n1.webp",
    images: [
      "/hotwheels/n1.webp",
      "/hotwheels/n2.webp",
      "/hotwheels/n3.webp"
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
    // await Category.deleteMany({});
    // await Product.deleteMany({});
    // console.log('Cleared existing data');

    // Update collections
    for (const col of collections) {
      await Category.updateOne(
        { slug: col.slug },
        { $set: { ...col } }
      );
    }

    // Update products
    for (const prod of products) {
      await Product.updateOne(
        { name: prod.name },
        { $set: { ...prod } }
      );
    }

    // Update model3D fields (already correct in your code)
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