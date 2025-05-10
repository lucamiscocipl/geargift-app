// filepath: geargift-react/src/components/Header.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useCart } from '../context/CartContext';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { cartCount } = useCart();
  const auth = getAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, [auth]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const geargiftLogo = isScrolled ? '/media/geargift-large-black.png' : '/media/geargift-large-white.png';
  // The header's className will now include 'scrolled' when applicable
  const headerClassName = `header ${isScrolled ? 'scrolled' : ''}`;

  return (
    <>
      {/* Apply the dynamic className and remove inline style for background */}
      <div className={headerClassName} id="main-header">
        <div className="logo-large">
          <Link to="/">
            <img src={geargiftLogo} alt="Geargift Logo" />
          </Link>
          {/* "Powered by" h1 and QRobotics logo will be styled by CSS via .header.scrolled .logo-large h1 */}
          <h1>Powered by</h1>
          <img src="/media/qrobotics-logo.png" alt="QRobotics Logo" />
        </div>
        <button className="hamburger" onClick={toggleMobileMenu}>☰</button>
        <div className="pages">
          <div className="page" id="home">
            <Link to="/"><h1>Home</h1></Link>
          </div>
          <div className="page" id="contact">
            <Link to="/inquiries"><h1>Inquire</h1></Link>
          </div>
          <div className="page" id="team-login">
            {isLoggedIn ? (
              <Link to="/team-dashboard"><h1>My Team</h1></Link>
            ) : (
              <Link to="/login"><h1>Team Login</h1></Link>
            )}
          </div>
          <div className="page" id="cart">
            <Link to="/cart">
              <h1>
                Cart
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </h1>
            </Link>
          </div>
        </div>
      </div>
      <div className={`menu ${isMobileMenuOpen ? 'active' : ''}`} id="mobileMenu">
        <a onClick={toggleMobileMenu}>Close ✖</a>
        <Link to="/" onClick={toggleMobileMenu}>Home</Link>
        <Link to="/inquiries" onClick={toggleMobileMenu}>Inquire</Link>
        {isLoggedIn ? (
          <Link to="/team-dashboard" onClick={toggleMobileMenu}>My Team</Link>
        ) : (
          <Link to="/login" onClick={toggleMobileMenu}>Team Login</Link>
        )}
        <Link to="/cart" onClick={toggleMobileMenu}>
          Cart {cartCount > 0 && `(${cartCount})`}
        </Link>
      </div>
    </>
  );
}

export default Header;