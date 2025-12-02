// filepath: geargift-react/src/pages/VendorPage.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProductItem from '../components/ProductItem';
import { useFirebase } from '../firebase/FirebaseContext';

function VendorPage() {
  const { vendorName } = useParams();
  const [vendorProducts, setVendorProducts] = useState([]);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const { vendors, fetchProducts } = useFirebase();

  useEffect(() => {
    const loadVendorData = async () => {
      setLoading(true);
      // Find vendor from context
      const foundVendor = vendors.find(
        v => v.name.toLowerCase() === vendorName.toLowerCase()
      );
      
      if (foundVendor) {
        setVendor(foundVendor);
        // Fetch products for this vendor
        const products = await fetchProducts(foundVendor.id);
        setVendorProducts(products);
      } else {
        setVendorProducts([]);
      }
      setLoading(false);
    };
    
    if (vendorName && vendors.length > 0) {
      loadVendorData();
    }
  }, [vendorName, vendors, fetchProducts]);

  return (
    <div className="container">
      <div className="section-2" id="product-section">
        <div className="divider-2">
          <h1>{vendor ? vendor.name : vendorName} products</h1>
          <div className="products-catalog">
            {loading ? (
              <p>Loading products...</p>
            ) : vendorProducts.length > 0 ? (
              vendorProducts.map((product) => (
                <ProductItem key={product.id} product={product} />
              ))
            ) : (
              <p>No products found for {vendor ? vendor.name : vendorName}.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorPage;