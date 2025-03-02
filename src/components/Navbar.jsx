import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);

  // Update `isAdmin` when user changes
  useEffect(() => {
    if (user && user.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  return (
    <nav>
      <Link to="/">Home</Link>
      {user ? (
        <>
          {isAdmin && <Link to="/add-hospital">Add Hospital</Link>}
          <Link to="/hospital-list">List of Hospitals</Link>
          <button onClick={logout}>Logout</button>
        </>
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
