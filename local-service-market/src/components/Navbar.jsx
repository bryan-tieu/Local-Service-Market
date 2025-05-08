import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isAuthenticated, handleLogout, userType }) => {
  const navigate = useNavigate();

  // Log the user out
  const handleLogoutClick = async () => {
    try {
      await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include',
    });
    
    handleLogout();
    navigate('/login');

    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo on the left */}
        <Link to="/" className="navbar-logo">
          Local Service Market
        </Link>

        {/* Navigation buttons on the right */}
        <ul className="nav-menu">
          {isAuthenticated ? (
            <React.Fragment>
            {userType === 'Worker' && (
              <React.Fragment>
                <li className="nav-item">
                  <Link to="/find_tasks" className="nav-links">
                  Find Tasks
                  </Link>
                </li>
              </React.Fragment>
            )}

            {userType === 'Employer' && (
              <React.Fragment>
                <li className="nav-item">
                  <Link to="/post_tasks" className="nav-links">
                  Post Task
                  </Link>
                </li>
              </React.Fragment>
            )}
              <li className="nav-item">
                <Link to="/tasks" className="nav-links">
                  Tasks
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/messages" className="nav-links">
                  Messages
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/account" className="nav-links">
                  Account
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogoutClick} className="nav-links logout-button">
                  Logout
                </button>
              </li>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <li className="nav-item">
                <Link to="/login" className="nav-links">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/signup" className="nav-links">
                  Sign Up
                </Link>
              </li>
            </React.Fragment>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;