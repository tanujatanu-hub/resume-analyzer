import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <span className="brand-icon">◈</span>
          <span className="brand-text">ResumeAI</span>
        </Link>
      </div>

      {user && (
        <div className="navbar-links">
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'nav-link active' : 'nav-link'}>
            Dashboard
          </Link>
          <Link to="/upload" className={location.pathname === '/upload' ? 'nav-link active' : 'nav-link'}>
            Analyze
          </Link>
        </div>
      )}

      <div className="navbar-right">
        {user ? (
          <>
            <span className="user-name">👤 {user.name}</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn-primary-sm">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
