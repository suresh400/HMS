import React from "react";
import "../css/contact.css";

const Contact = () => {
  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <p>If you have any questions or need support, feel free to reach out.</p>

      <div className="contact-details">
        <h3>Our Address</h3>
        <p>LPU Phagwara,Punjab, India</p>

        <h3>Email</h3>
        <p>
          <a href="mailto:chsuresh3839@gmail.com">chsuresh3839@gmail.com</a>
        </p>

        <h3>Phone</h3>
        <p>+91 123456789</p>
      </div>
    </div>
  );
};

export default Contact;
