import { useState, useEffect } from 'react';

function ProductItem({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 480);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showButton = isMobileView || isHovered;
  const showName = isMobileView || !isHovered;

  // Basic notification handler
  const handleNotifyOwner = (productName) => {
    alert(`Notification for ${productName} would be sent here.`);
    // In a real app, this would trigger an API call or other logic
  };

  return (
    <div
      className="product"
      onMouseEnter={() => !isMobileView && setIsHovered(true)}
      onMouseLeave={() => !isMobileView && setIsHovered(false)}
    >
      <img src={product.imgSrc} alt={product.name} />
      {showName && <h1>{product.name}</h1>}
      {showButton && <a onClick={() => handleNotifyOwner(product.name)} style={{cursor: 'pointer'}}>Notify owner</a>}
    </div>
  );
}

export default ProductItem;