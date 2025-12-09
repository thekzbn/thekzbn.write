import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="home-container">
      <h1 className="home-title">@thekzbn.write</h1>
      <p className="home-description">Your modern Markdown editor for blog posts, built with simplicity and elegance.</p>
      <div className="home-links">
        {user ? (
          <Link to="/editor" className="button primary-button">Go to Editor</Link>
        ) : (
          <Link to="/login" className="button primary-button">Login to Start Writing</Link>
        )}
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