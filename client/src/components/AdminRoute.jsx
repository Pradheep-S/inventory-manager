import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corrected import

// eslint-disable-next-line react/prop-types
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Redirect to login if no token exists
  if (!token) return <Navigate to="/login" />;

  try {
    // Decode the token
    const decoded = jwtDecode(token);

    // Check if the user has the "admin" role
    return decoded.role === "admin" ? children : <Navigate to="/" />;
  } catch (error) {
    // Handle invalid or expired tokens
    console.error("Invalid token:", error);
    return <Navigate to="/login" />;
  }
};

export default AdminRoute;