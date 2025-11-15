import React, { useState } from "react";
import "./Footer.css";
import AppDownload from "../AppDownload/AppDownload";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (contactMessage.trim()) {
      setIsSubmitted(true);
      setContactMessage("");
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <footer className="footer" id="footer">
      <div className="footer-content">
        {/* Left section */}
        <div className="footer-content-left">
          <h1 className="footer-logo">
            Zes<span>ty</span>
          </h1>
          <p className="footer-address">
            Zesty Foods Pvt Ltd <br />
            Colombo, Light House Road, Sri Lanka
          </p>
          <div className="footer-social-icons">
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Center section */}
        <div className="footer-content-center">
          <h2>Company</h2>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Right section */}
        <div className="footer-content-right">
          <h2>Get in touch</h2>
          <ul>
            <li>+94-11-2345678</li>
            <li>contact@zesty.com</li>
          </ul>
          <div className="quick-contact">
            <h3>Quick Contact</h3>
            <form onSubmit={handleContactSubmit}>
              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Send us a message..."
                rows="3"
                required
              />
              <button type="submit">Send</button>
            </form>
            {isSubmitted && (
              <p className="success-message">Message sent successfully!</p>
            )}
          </div>
        </div>
      </div>

      {/* App Download section */}
      <AppDownload />

      <hr />
      <p className="footer-copyright">
        Copyright 2024 @ Zesty.com - All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
