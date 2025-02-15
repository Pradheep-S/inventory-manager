import { Link } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">Mithun Electricals</div>
      <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <ul>
          <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link to="/inventory" onClick={() => setIsMenuOpen(false)}>Inventory</Link></li>
          <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact Us</Link></li>
          <li><Link to="/admin-login" onClick={() => setIsMenuOpen(false)}>Login as Admin</Link></li>
          
        </ul>
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        <div className={`bar ${isMenuOpen ? "change" : ""}`}></div>
        <div className={`bar ${isMenuOpen ? "change" : ""}`}></div>
        <div className={`bar ${isMenuOpen ? "change" : ""}`}></div>
      </div>
    </nav>
  );
};

export default Navbar;