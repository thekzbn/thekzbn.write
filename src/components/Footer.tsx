import React from 'react';
import { FaXTwitter, FaInstagram } from 'react-icons/fa6'; // Using fa6 for new X icon

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <p>Built with intention by <a href="https://thekzbn.name.ng" target="_blank" rel="noopener noreferrer">@thekzbn</a></p>
      <div className="social-links">
        <a href="https://x.com/thekzbn_me" target="_blank" rel="noopener noreferrer" aria-label="Visit thekzbn on X">
          <FaXTwitter />
        </a>
        <a href="https://instagram.com/thekzbn.me" target="_blank" rel="noopener noreferrer" aria-label="Visit thekzbn on Instagram">
          <FaInstagram />
        </a>
      </div>
    </footer>
  );
};

export default Footer;