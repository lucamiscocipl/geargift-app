// filepath: geargift-react/src/pages/HomePage.jsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useFirebase } from '../firebase/FirebaseContext';

function HomePage() {
  const { vendors, loading, error } = useFirebase();
  
  const handleExploreVendorsClick = () => {
    const element = document.querySelector('.divider-2');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container">
      <div className="section-1">
        <div className="divider-1">
          <div className="content-box">
            <img src="/media/geargift-white.png" alt="Geargift" className="hero-logo" />
            <h1>
              GearGift is a platform designed to support FTC teams exchange and
              access essential robot parts from vendors such as REV, Tetrix,
              goBilda, and Axon. Teams can list available components and request
              specific parts.
            </h1>
            <a className="button" onClick={handleExploreVendorsClick} style={{cursor: 'pointer'}}>
              Explore our vendors
            </a>
          </div>
        </div>
      </div>
      <div className="section-2">
        <div className="divider-2">
          <h1>Our vendors</h1>
          <div className="vendors-catalog">
            {loading ? (
              <p>Loading vendors...</p>
            ) : error ? (
              <p>Error loading vendors: {error}</p>
            ) : (
              vendors.map((vendor) => (
                <Link to={`/vendors/${vendor.name.toLowerCase()}`} className="vendor" key={vendor.id}>
                  <img src={vendor.logo} alt={vendor.name} />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;