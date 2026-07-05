import mongoose from 'mongoose';
import { config } from 'dotenv';
import { Product } from '../models/product.model';
import dns from 'dns';


try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  console.log('DNS resolvers overridden');
} catch (e) {
  console.warn('Could not override DNS:', e);
}

config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ns-computers';

const sampleProducts = [
  {
    name: "ASUS ROG Strix G15",
    description: "High-performance gaming laptop with NVIDIA GeForce RTX 3060, AMD Ryzen 7 5800H, 16GB RAM, 512GB SSD.",
    category: "laptops",
    price: 385000,
    stock: 10,
    rating: 4.8,
    specs: ["AMD Ryzen 7 5800H", "16GB DDR4 RAM", "512GB NVMe SSD", "RTX 3060 6GB GDDR6", "15.6\" 144Hz FHD Screen"],
    currency: "LKR",
    isOnSale: false,
    imageUrl: "/images/Asus rog.jpg"
  },
  {
    name: "ASUS TUF Gaming F15",
    description: "Robust and military-grade gaming laptop featuring Intel Core i5 11th Gen, GTX 1650, 8GB RAM, 512GB SSD.",
    category: "laptops",
    price: 220000,
    stock: 15,
    rating: 4.5,
    specs: ["Intel Core i5-11400H", "8GB DDR4 RAM", "512GB NVMe SSD", "GTX 1650 4GB GDDR6", "15.6\" 144Hz FHD Screen"],
    currency: "LKR",
    isOnSale: true,
    originalPrice: 245000,
    imageUrl: "/images/asus tuf2.webp"
  },
  {
    name: "MSI Katana GF66",
    description: "Sleek and powerful gaming laptop with Intel Core i7 12th Gen, RTX 3050 Ti, 16GB RAM, 512GB SSD.",
    category: "laptops",
    price: 295000,
    stock: 8,
    rating: 4.6,
    specs: ["Intel Core i7-12700H", "16GB DDR4 RAM", "512GB NVMe SSD", "RTX 3050 Ti 4GB GDDR6", "15.6\" 144Hz FHD Screen"],
    currency: "LKR",
    isOnSale: false,
    imageUrl: "/images/msi.jpg"
  },
  {
    name: "Apple MacBook Pro 14\"",
    description: "Professional workstation laptop with Apple M2 Pro chip, 16GB Unified Memory, 512GB SSD.",
    category: "workstations",
    price: 680000,
    stock: 5,
    rating: 4.9,
    specs: ["Apple M2 Pro 10-Core CPU", "16GB Unified Memory", "512GB Superfast SSD", "14-Core GPU", "14.2\" Liquid Retina XDR"],
    currency: "LKR",
    isOnSale: false,
    imageUrl: "/images/macbooks.png"
  },
  {
    name: "Custom Gaming PC Build",
    description: "Pre-built custom gaming desktop PC with Intel Core i5 13th Gen, RTX 4060, 16GB RAM, 1TB SSD, Liquid Cooler.",
    category: "desktops",
    price: 310000,
    stock: 3,
    rating: 4.7,
    specs: ["Intel Core i5-13400F", "16GB DDR5 5200MHz RAM", "1TB Gen4 NVMe SSD", "RTX 4060 8GB GDDR6", "240mm AIO Liquid Cooler"],
    currency: "LKR",
    isOnSale: true,
    originalPrice: 340000,
    imageUrl: "/images/gaming pc.jpg"
  }
];

const seedDB = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully!');

    
    console.log('Deleting existing products...');
    await Product.deleteMany({});
    
    
    console.log('Clearing product counter...');
    try {
      await mongoose.connection.db?.collection('productcounters').deleteMany({});
      console.log('Cleared counters.');
    } catch (e) {
      console.log('No counters found to clear.');
    }

    
    console.log('Inserting sample products...');
    for (const prodData of sampleProducts) {
      const product = new Product(prodData);
      await product.save();
      console.log(`Seeded: ${product.name} with ID: ${product._id}`);
    }
    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database.');
  }
};

seedDB();
