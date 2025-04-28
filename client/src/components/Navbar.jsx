import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../pages/CartContext";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const { cartCount, user } = useCart();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/auth");
    window.location.reload();
    setIsProfileOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isProfileOpen &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

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

  const getUsername = () => {
    return user?.username || user?.name || "User";
  };

  return (
    <nav className={`navbar ${isHidden ? "hidden" : ""}`}>
      <div className="logo">Mithun Electricals</div>
      <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <ul>
          {[
            { to: "/", text: "Home" },
            { to: "/products", text: "Products" },
            { to: "/contact", text: "Contact Us" },
            ...(user && user.role === "admin"
              ? [{ to: "/admin/dashboard", text: "Admin" }]
              : user
              ? [{ to: "/cart", text: `Cart (${cartCount})` }]
              : []),
          ].map((item, index) => (
            <li key={index} style={{ "--i": index }}>
              <Link to={item.to} onClick={() => setIsMenuOpen(false)}>
                {item.text.startsWith("Cart") ? (
                  <span>
                    <FaShoppingCart /> {item.text}
                  </span>
                ) : (
                  item.text
                )}
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
              <li className="profile-icon" style={{ "--i": 5 }} ref={profileRef}>
                <FaUserCircle
                  className="profile-icon-img"
                  onClick={toggleProfile}
                />
                {isProfileOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-details">
                      <h3>Profile</h3>
                      <p>Username: {getUsername()}</p>
                      {user.email && <p>Email: {user.email}</p>}
                      {user.role && <p>Role: {user.role}</p>}
                      <Link to="/profile" className="profile-link" onClick={() => setIsProfileOpen(false)}>
                        Manage Profile
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            </>
          ) : (
            <li style={{ "--i": 3 }}>
              <Link
                to="/auth"
                className="auth-link login-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </li>
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