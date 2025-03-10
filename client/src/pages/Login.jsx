import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isAdminLogin 
        ? "http://localhost:5000/api/auth/admin-login" 
        : "http://localhost:5000/api/auth/login";
      
      const res = await axios.post(endpoint, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      if (isAdminLogin && res.data.user.role === "admin") {
        localStorage.setItem("isAdmin", "true");
        navigate("/admin/dashboard"); // Redirect to admin dashboard
      } else {
        localStorage.setItem("isAdmin", "false"); // Ensure isAdmin is false for regular users
        navigate("/"); // Redirect to home page for regular users
      }
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {error && <p className="login-error">{error}</p>}
      <form onSubmit={handleLogin} className="login-form">
        <div className="login-form-group">
          <label htmlFor="email" className="login-label">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
        </div>
        <div className="login-form-group">
          <label htmlFor="password" className="login-label">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
        </div>
        <div className="login-form-group login-checkbox">
          <input
            type="checkbox"
            id="adminLogin"
            checked={isAdminLogin}
            onChange={() => setIsAdminLogin(!isAdminLogin)}
          />
          <label htmlFor="adminLogin" className="login-label">Login as Admin</label>
        </div>
        <button type="submit" className="login-button">
          {isAdminLogin ? "Admin Login" : "Login"}
        </button>
      </form>
      <p className="login-signup-text">
        Don&apos;t have an account? <Link to="/signup" className="login-signup-link">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;