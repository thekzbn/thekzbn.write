import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">@thekzbn.write</h1>
      <p className="home-description">Your modern Markdown editor for blog posts, built with simplicity and elegance.</p>
      <div className="home-links">
        <Link to="/editor" className="button primary-button">Start Writing</Link>
        <a
          href="https://github.com/thekzbn/thekzbn.write"
          target="_blank"
          rel="noopener noreferrer"
          className="button secondary-button"
        >
          View on GitHub
        </a>
      </div>
    </div>
  );
};

export default Home;