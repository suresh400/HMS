import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/auth.css";
import { API_BASE_URL } from "../config";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });
  const [error, setError] = useState(""); // ✅ Added error state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // ✅ Reset error before new request

    try {
      await axios.post(`${API_BASE_URL}/api/v1/auth/register`, formData);
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      setError(error?.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <img src="./src/assets/login.jpg" alt="register" />
      <div className="form">
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>} {/* ✅ Show error message */}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

        <label >Role:</label>
        <select name="role" value={formData.role} onChange={handleChange}> {/* ✅ Ensure controlled input */}
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
    </div>
  );
};

export default Register;
