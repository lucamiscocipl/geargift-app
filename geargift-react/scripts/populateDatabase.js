import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { productsData } from '../src/data/products.js';

// Firebase configuration from your .env file
const firebaseConfig = {
  apiKey: "AIzaSyCvWoWMR6mB_W3KK9bipQL5hV7yXxCEBMA",
  authDomain: "geargift-rq.firebaseapp.com",
  projectId: "geargift-rq",
  storageBucket: "geargift-rq.firebasestorage.app",
  messagingSenderId: "288602223139",
  appId: "1:288602223139:web:119904c9c2b722ae903796",
  measurementId: "G-0FEWL6SSDP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Vendor logo mapping
const vendorLogos = {
  andymark: "/media/andymark-logo.png",
  tetrix: "/media/tetrix-logo.png",
  rev: "/media/rev-logo.png",
  gobilda: "/media/gobilda-logo.png"
};

// Function to clear existing data (optional)
async function clearCollections() {
  console.log("Clearing existing collections...");
  
  // Clear vendors collection
  const vendorsSnapshot = await getDocs(collection(db, 'vendors'));
  const deleteVendorsPromises = vendorsSnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deleteVendorsPromises);
  
  // Clear products collection
  const productsSnapshot = await getDocs(collection(db, 'products'));
  const deleteProductsPromises = productsSnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deleteProductsPromises);
  
  console.log("Collections cleared.");
}

// Function to populate the database
async function populateDatabase() {
  try {
    // Optional: Uncomment to clear existing data first
    // await clearCollections();
    
    console.log("Starting database population...");
    
    // Step 1: Create vendors
    const vendorIds = {};
    
    for (const vendorName in productsData) {
      console.log(`Adding vendor: ${vendorName}`);
      
      const vendorData = {
        name: vendorName.charAt(0).toUpperCase() + vendorName.slice(1), // Capitalize first letter
        logo: vendorLogos[vendorName] || "/media/default-logo.png",
        createdAt: new Date()
      };
      
      const vendorRef = await addDoc(collection(db, 'vendors'), vendorData);
      vendorIds[vendorName] = vendorRef.id;
      console.log(`Vendor ${vendorName} added with ID: ${vendorRef.id}`);
    }
    
    // Step 2: Create products for each vendor
    for (const vendorName in productsData) {
      const products = productsData[vendorName];
      const vendorId = vendorIds[vendorName];
      
      console.log(`Adding ${products.length} products for ${vendorName}...`);
      
      for (const product of products) {
        const productData = {
          name: product.name,
          imgSrc: product.imgSrc,
          vendorId: vendorId,
          vendorName: vendorName.charAt(0).toUpperCase() + vendorName.slice(1),
          price: Math.floor(Math.random() * 100) + 10, // Random price between $10-$110 for demo
          available: true,
          createdAt: new Date()
        };
        
        const productRef = await addDoc(collection(db, 'products'), productData);
        console.log(`Product ${product.name} added with ID: ${productRef.id}`);
      }
    }
    
    console.log("Database population completed successfully!");
  } catch (error) {
    console.error("Error populating database:", error);
  }
}

// Run the population function
populateDatabase();