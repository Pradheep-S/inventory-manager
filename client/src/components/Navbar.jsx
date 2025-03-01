import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Corrected import
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token); // Decode the JWT token
      setUser(decoded);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav className={`navbar ${isHidden ? "hidden" : ""}`}>
      <div className="logo">Mithun Electricals</div>
      <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <ul>
          <li>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/products" onClick={() => setIsMenuOpen(false)}>
              Products
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
              Contact Us
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  Signup
                </Link>
              </li>
            </>
          )}
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