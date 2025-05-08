import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import './AuthLayout.css'

const Login = (props) => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Handles user input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handles user submission
  const handleSubmit = async (e) => {
    
    e.preventDefault();

    // Clear previous error messages
    setError('');

    // Validate form data
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          userEmail: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      // Handle failed login
      if (!response.ok) {
        const errorData = await response.json();
        console.error('ERROR:', errorData);
        throw new Error(data.message || 'Login failed!');
      }

      // Navigation based on user type
      if (data.user.userType === 'Worker') {
        navigate('/worker-dashboard');
      } else {
        navigate('/employer-dashboard'); 
      }

      // Call the onLogin prop if provided
      if (props.onLogin) {
        props.onLogin(data.user);
      }

    } catch (error) {
      setError(error.message);
      console.error('Login error:', error);
    }
  };

  return (
    <div className='auth-page-container main-content'>
      <div className="auth-form-container">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;