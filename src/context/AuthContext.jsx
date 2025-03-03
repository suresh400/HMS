import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate only inside a component

// Create Auth Context
export const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  // ✅ Fetch User Data when App Loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (token && storedUser) {
      setUser(storedUser);
    }
  }, []);

  // ✅ Login Function
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // ✅ Clear stored user data
    setUser(null);

    // ✅ Redirect after logout
    setTimeout(() => {
      navigate("/"); // ✅ Redirect to home page
    }, 0);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
