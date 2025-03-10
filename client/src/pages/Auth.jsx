import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        const response = await axios.post("http://localhost:5000/api/auth/register", {
          username,
          email,
          password,
        });
        console.log("Registration successful:", response.data);
        // Instead of navigating, switch to login form
        setIsSignup(false); // Switch to login mode
        setUsername(""); // Clear username
        setEmail(""); // Clear email
        setPassword(""); // Clear password
        setError(""); // Clear any errors
      } else {
        const endpoint = isAdminLogin
          ? "http://localhost:5000/api/auth/admin-login"
          : "http://localhost:5000/api/auth/login";
        const res = await axios.post(endpoint, { email, password });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        if (isAdminLogin && res.data.user.role === "admin") {
          localStorage.setItem("isAdmin", "true");
          navigate("/admin/dashboard");
        } else {
          localStorage.setItem("isAdmin", "false");
          navigate("/");
        }
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.error || (isSignup ? "Failed to register" : "Invalid credentials"));
    }
  };

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setError("");
    setUsername("");
    setEmail("");
    setPassword("");
    setIsAdminLogin(false);
  };

  return (
    <div className="auth-wrapper auth-body">
      <div className={`auth-container ${isSignup ? "signup" : ""}`}>
        <div className="auth-left">
          <h1 className="auth-brand-title">Welcome</h1>
          <h2 className="auth-company-name">Mithun Electricals</h2>
          <p className="auth-brand-text">
            {isSignup ? "Already have an account?" : "Need an account?"}{" "}
            <span className="auth-toggle-link" onClick={toggleForm}>
              {isSignup ? "Login" : "Sign Up"}
            </span>
          </p>
        </div>

        <div className="auth-right">
          <form onSubmit={handleSubmit} className="auth-form">
            <h2 className="auth-title">{isSignup ? "Sign Up" : "Login"}</h2>
            {error && <p className="auth-error">{error}</p>}

            {isSignup && (
              <div className="auth-form-group">
                <label htmlFor="username" className="auth-label">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="auth-input"
                  required
                />
              </div>
            )}

            <div className="auth-form-group">
              <label htmlFor="email" className="auth-label">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                required
              />
            </div>

            <div className="auth-form-group">
              <label htmlFor="password" className="auth-label">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                required
              />
            </div>

            {!isSignup && (
              <div className="auth-form-group auth-checkbox">
                <input
                  type="checkbox"
                  id="adminLogin"
                  checked={isAdminLogin}
                  onChange={() => setIsAdminLogin(!isAdminLogin)}
                />
                <label htmlFor="adminLogin" className="auth-label">Login as Admin</label>
              </div>
            )}

            <button type="submit" className="btn-primary">
              {isSignup ? "Sign Up" : isAdminLogin ? "Admin Login" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;