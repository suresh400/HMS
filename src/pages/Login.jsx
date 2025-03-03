import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config";
import loginImage from "../assets/login.jpg"; // ✅ Corrected Image Import
import "../css/auth.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Added Loading State

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true); // ✅ Show Loading Indicator

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/auth/login`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("token", response.data.token);
      login(response.data.user, response.data.token);

      navigate("/");
    } catch (error) {
      console.error("Login Error:", error?.response?.data || error.message);
      setError(error?.response?.data?.error || "Invalid credentials. Try again.");
    } finally {
      setLoading(false); // ✅ Hide Loading Indicator
    }
  };

  return (
    <div className="auth-container">
      <img src={loginImage} alt="login" />
      <div className="form">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>Don't have an account? <a href="/register">Register</a></p>
      </div>
    </div>
  );
};

export default Login;
