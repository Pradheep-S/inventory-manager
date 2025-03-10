import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode"; // Fixed: Use named import

const AdminRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token); // Use the named import
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        console.error("Token has expired");
        localStorage.removeItem("token");
        setIsLoading(false);
        return;
      }

      setUser(decoded);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to decode token:", error);
      localStorage.removeItem("token");
      setIsLoading(false);
    }
  }, [token]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/auth" />;
  }

  if (user && user.role === "admin") {
    return children;
  } else {
    return <Navigate to="/auth" />;
  }
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminRoute;