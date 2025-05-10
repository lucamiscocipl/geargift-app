// filepath: geargift-react/src/pages/HomePage.jsx
import { Link } from 'react-router-dom'; // Make sure this is present

// You'll migrate content from your old index.html's body here
// Remember to adjust image paths, e.g., src="/media/geargift-white.png"

function HomePage() {
  // Placeholder for scrollToElement logic, or use React-specific scroll libraries
  const handleExploreVendorsClick = () => {
    // Example: document.querySelector('.divider-2').scrollIntoView({ behavior: 'smooth' });
    // Or better, use refs if the target is within a React component.
    const element = document.querySelector('.divider-2'); // Simple for now
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
            <Link to="/vendors/andymark" className="vendor">
               <img style={{transform: "translateY(-10px)"}} src="/media/andymark-logo.png" alt="Andymark" />
            </Link>
             <Link to="/vendors/tetrix" className="vendor">
               <img src="/media/tetrix-logo.png" alt="Tetrix" />
            </Link>
             <Link to="/vendors/rev" className="vendor">
               <img src="/media/rev-logo.png" alt="REV" />
            </Link>
             <Link to="/vendors/gobilda" className="vendor">
               <img style={{transform: "translateY(20px)"}} src="/media/gobilda-logo.png" alt="goBILDA" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;