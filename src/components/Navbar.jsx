import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../css/navbar.css";
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const isAdmin = user?.role === "admin"; // Check if user is an admin

  return (
    <nav className="navbar">
      <h1>HMS</h1>
      <Link to="/">Home</Link>

      {/* Show Add Hospital only if Admin */}
      {isAdmin && <Link to="/add-hospital">Add Hospital</Link>}

      {/* Show Hospital List only if User is logged in */}
      {user && <Link to="/hospital-list">List of Hospitals</Link>}

      {/* Auth Buttons */}
      {user ? (
        <button onClick={logout} className="logout-btn">Logout</button>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
