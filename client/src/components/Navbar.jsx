import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
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
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/auth");
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
          {[
            { to: "/", text: "Home" },
            { to: "/products", text: "Products" },
            { to: "/contact", text: "Contact Us" },
            ...(user ? [{ to: "/admin/dashboard", text: "Admin" }] : []),
          ].map((item, index) => (
            <li key={index} style={{ "--i": index }}>
              <Link to={item.to} onClick={() => setIsMenuOpen(false)}>
                {item.text}
              </Link>
            </li>
          ))}
          {user ? (
            <>
              <li style={{ "--i": 4 }}>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
              <li className="profile-icon" style={{ "--i": 5 }}>
                <span>{user.username}</span>
              </li>
            </>
          ) : (
            <>
              <li style={{ "--i": 3 }}>
                <Link
                  to="/auth"
                  className="auth-link login-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
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