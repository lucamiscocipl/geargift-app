import { useState } from 'react';
import { useCart } from '../context/CartContext';

function ProductItem({ product }) {
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    
    // Show "Added" feedback briefly
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  return (
    <div className="product">
      <img src={product.imgSrc} alt={product.name} />
      <h3>{product.name}</h3>
      <div className="product-info">
        <p className="product-vendor">{product.vendorName}</p>
      </div>
      <div className="product-actions">
        <button 
          className={`cart-button ${addedToCart ? 'added' : ''}`}
          onClick={handleAddToCart}
          disabled={addedToCart}
        >
          {addedToCart ? 'Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default ProductItem;