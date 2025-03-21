import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import axios from "axios"; // Added axios for API calls
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0); // New state for cart item count
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Fetch cart count when user is logged in
  useEffect(() => {
    const fetchCartCount = async () => {
      const token = localStorage.getItem("token");
      if (!token || !user || user.role === "admin") {
        setCartCount(0); // Reset count if no user or user is admin
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/cart", {
          headers: { "x-access-token": token },
        });
        const items = res.data.items || [];
        const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(totalCount);
      } catch (error) {
        console.error("Error fetching cart count:", error);
        setCartCount(0); // Reset on error
      }
    };

    fetchCartCount();
  }, [user]); // Re-fetch when user changes (login/logout)

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Remove token as well
    setUser(null);
    setCartCount(0); // Reset cart count on logout
    setIsProfileOpen(false);
    navigate("/auth");
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
              ? [{ to: "/cart", text: `Cart(${cartCount})` }] // Updated Cart link with count
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