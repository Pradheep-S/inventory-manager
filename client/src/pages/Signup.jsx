import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        password,
      });
      console.log("Registration successful:", response.data);
      navigate("/auth");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to register");
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Signup</h2>
      {error && <p className="signup-error">{error}</p>}
      <form onSubmit={handleSignup} className="signup-form">
        <div className="signup-form-group">
          <label htmlFor="username" className="signup-label">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="signup-input"
            required
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="email" className="signup-label">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signup-input"
            required
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="password" className="signup-label">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-input"
            required
          />
        </div>
        <button type="submit" className="signup-button">Signup</button>
      </form>
      <p className="signup-login-text">
        Already have an account? <Link to="/login" className="signup-login-link">Login</Link>
      </p>
    </div>
  );
};

export default Signup;