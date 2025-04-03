import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import './AuthLayout.css'

const Login = () => {
  const [formData, setFormData] = useState({
    userID: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userID: formData.userID,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed!');
      }

      console.log('Login successful:', data.user);

      if (data.user.userType === 'worker') {
        navigate('/worker-dashboard');
      } else {
        navigate('/employer-dashboard');
      }
    } catch (error) {
      setError(error.message);
      console.error('Login error:', error);
    }
  };

  return (
    <div className='auth-page-container'>
      <div className="auth-form-container">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="userID">User ID</label>
            <input
              type="text"
              id="userID"
              name="userID"
              value={formData.userID}
              onChange={handleChange}
              required
              placeholder="Enter your user ID"
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