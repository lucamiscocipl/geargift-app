import { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const auth = getAuth();
  const db = getFirestore();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Load team's cart from database when logged in
        loadCartFromDatabase(user.uid);
      } else {
        // Load cart from localStorage when not logged in
        loadCartFromLocalStorage();
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // Load cart from localStorage (for non-authenticated users)
  const loadCartFromLocalStorage = () => {
    setLoading(true);
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        setCartCount(parsedCart.reduce((total, item) => total + item.quantity, 0));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        setCartItems([]);
        setCartCount(0);
      }
    } else {
      setCartItems([]);
      setCartCount(0);
    }
    setLoading(false);
  };

  // Load cart from Firebase database
  const loadCartFromDatabase = async (userId) => {
    setLoading(true);
    try {
      const teamDoc = await getDoc(doc(db, 'teams', userId));
      
      if (teamDoc.exists() && teamDoc.data().cart) {
        const cartData = teamDoc.data().cart;
        setCartItems(cartData);
        setCartCount(cartData.reduce((total, item) => total + item.quantity, 0));
      } else {
        // If no cart exists in the database yet, check localStorage
        // This handles the case of logging in after adding items as a guest
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            if (parsedCart.length > 0) {
              setCartItems(parsedCart);
              setCartCount(parsedCart.reduce((total, item) => total + item.quantity, 0));
              
              // Save the localStorage cart to the database
              await updateDoc(doc(db, 'teams', userId), {
                cart: parsedCart
              });
            } else {
              setCartItems([]);
              setCartCount(0);
            }
          } catch (error) {
            console.error('Error handling localStorage cart during login:', error);
            setCartItems([]);
            setCartCount(0);
          }
        } else {
          setCartItems([]);
          setCartCount(0);
        }
      }
    } catch (error) {
      console.error('Error loading cart from database:', error);
      setCartItems([]);
      setCartCount(0);
    }
    setLoading(false);
  };

  // Save cart to appropriate storage
  const saveCart = async (items) => {
    // Always update local state
    setCartItems(items);
    setCartCount(items.reduce((total, item) => total + item.quantity, 0));
    
    // Save to localStorage for non-authenticated users
    localStorage.setItem('cart', JSON.stringify(items));
    
    // If user is logged in, save to database
    if (currentUser) {
      try {
        await updateDoc(doc(db, 'teams', currentUser.uid), {
          cart: items
        });
      } catch (error) {
        console.error('Error saving cart to database:', error);
      }
    }
  };

  const addToCart = (product) => {
    const updatedItems = [...cartItems];
    const existingItemIndex = updatedItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
      // Item exists, update quantity
      updatedItems[existingItemIndex].quantity += 1;
    } else {
      // Item doesn't exist, add new item
      updatedItems.push({ ...product, quantity: 1 });
    }
    
    saveCart(updatedItems);
  };

  const removeFromCart = (productId) => {
    const updatedItems = cartItems.filter(item => item.id !== productId);
    saveCart(updatedItems);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    
    const updatedItems = cartItems.map(item => 
      item.id === productId ? { ...item, quantity } : item
    );
    
    saveCart(updatedItems);
  };

  const clearCart = async () => {
    saveCart([]);
  };

  const value = {
    cartItems,
    cartCount,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};