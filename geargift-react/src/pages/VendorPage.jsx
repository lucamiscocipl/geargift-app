// filepath: geargift-react/src/pages/VendorPage.jsx
import { useParams } from 'react-router-dom';
import { productsData } from '../data/products'; // Import the product data
import ProductItem from '../components/ProductItem'; // Import the ProductItem component
import { useEffect, useState } from 'react';

function VendorPage() {
  const { vendorName } = useParams();
  const [vendorProducts, setVendorProducts] = useState([]);
  const [capitalizedVendorName, setCapitalizedVendorName] = useState('');


  useEffect(() => {
    // Normalize vendorName from URL to match keys in productsData (e.g., "andymark", "rev")
    const normalizedVendorName = vendorName?.toLowerCase();
    if (normalizedVendorName && productsData[normalizedVendorName]) {
      setVendorProducts(productsData[normalizedVendorName]);
      setCapitalizedVendorName(vendorName.charAt(0).toUpperCase() + vendorName.slice(1));
    } else {
      setVendorProducts([]); // Handle case where vendorName is not found
      setCapitalizedVendorName(vendorName || 'Unknown');
    }
  }, [vendorName]);

  return (
    <div className="container">
      <div className="section-2" id="product-section">
        <div className="divider-2">
          <h1>{capitalizedVendorName} products</h1>
          <div className="products-catalog">
            {vendorProducts.length > 0 ? (
              vendorProducts.map((product, index) => (
                <ProductItem key={index} product={product} />
              ))
            ) : (
              <p>No products found for {capitalizedVendorName}.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorPage;