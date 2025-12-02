import { createContext, useContext, useState, useEffect } from 'react';
import { db } from './config';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';

const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all vendors
  const fetchVendors = async () => {
    try {
      const vendorsCollection = collection(db, 'vendors');
      const vendorSnapshot = await getDocs(vendorsCollection);
      const vendorList = vendorSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVendors(vendorList);
      return vendorList;
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError(err.message);
      return [];
    }
  };

  // Fetch all products or filter by vendorId
  const fetchProducts = async (vendorId = null) => {
    try {
      let productsQuery;
      if (vendorId) {
        productsQuery = query(
          collection(db, 'products'),
          where('vendorId', '==', vendorId)
        );
      } else {
        productsQuery = collection(db, 'products');
      }
      
      const productSnapshot = await getDocs(productsQuery);
      const productList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      if (!vendorId) {
        setProducts(productList);
      }
      
      return productList;
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      return [];
    }
  };

  // Get a single vendor by ID
  const getVendor = async (id) => {
    try {
      const vendorDoc = await getDoc(doc(db, 'vendors', id));
      if (vendorDoc.exists()) {
        return { id: vendorDoc.id, ...vendorDoc.data() };
      } else {
        return null;
      }
    } catch (err) {
      console.error('Error fetching vendor:', err);
      setError(err.message);
      return null;
    }
  };

  // Get a single product by ID
  const getProduct = async (id) => {
    try {
      const productDoc = await getDoc(doc(db, 'products', id));
      if (productDoc.exists()) {
        return { id: productDoc.id, ...productDoc.data() };
      } else {
        return null;
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message);
      return null;
    }
  };

  // Add a new inquiry
  const addInquiry = async (inquiry) => {
    try {
      const docRef = await addDoc(collection(db, 'inquiries'), {
        ...inquiry,
        createdAt: new Date()
      });
      return { id: docRef.id, ...inquiry };
    } catch (err) {
      console.error('Error adding inquiry:', err);
      setError(err.message);
      throw err;
    }
  };

  // Initialize data fetch
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        await fetchVendors();
        await fetchProducts();
        setLoading(false);
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  const value = {
    vendors,
    products,
    loading,
    error,
    fetchVendors,
    fetchProducts,
    getVendor,
    getProduct,
    addInquiry
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};