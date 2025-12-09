import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Editor from './pages/Editor';
import Footer from './components/Footer';
import './App.css'; // Global application styles

import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';

const Content: React.FC = () => {
  const location = useLocation();
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
      {location.pathname !== '/editor' && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Content />
      </AuthProvider>
    </Router>
  );
};

export default App;