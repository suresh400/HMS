import React from "react";
import "../css/footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Hospital Management System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
