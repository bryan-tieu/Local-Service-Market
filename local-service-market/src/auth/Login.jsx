import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

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
    
    try {
      // First check the userID format
      if (!/^[01]\d+$/.test(formData.userID)) {
        throw new Error('Invalid userID format');
      }

      // Here you would typically call your authentication API
      // For now, we'll just handle the navigation based on userID
      if (formData.userID.startsWith('0')) {
        navigate('/employer-dashboard'); // Route to employer page
      } else if (formData.userID.startsWith('1')) {
        navigate('/worker-dashboard'); // Route to worker page
      }

    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-container">
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
  );
};

export default Login;