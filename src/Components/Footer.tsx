// Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer-links">
      <Link to="/contact">Contact</Link>
      <Link to="/privacy-policy">Privacy Policy</Link>
      <Link to="/terms-conditions">Terms & Conditions</Link>
    </div>
  </footer>
);

export default Footer;
