import React, { useState } from 'react';
import './Signup.css';
import './AuthLayout.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'worker'
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
        const response = await fetch('http://localhost:5000/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 409 && data.message.includes('already exists')) {
            setError('Email already exists. Please use a different email.');
          } else {
            setError(data.message || 'Something went wrong!');
          }
          return;
          }
        
        console.log('Signup successful:', data);
        setError('');
        setFormData({
            name: '',
            email: '',
            password: '',
            });
    } catch (error) {
        setError(error.message);
    }
    console.log('Form submitted:', formData);
  };

  return (
    <div className='auth-page-container'>
      <div className="auth-form-container">
        <h2>Create Your Account</h2>
        {error && (
          <div className='error-message'>{error}</div>
        )}
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder='Enter your full name'
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder='Enter your email address'
              required
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
              placeholder='Create a password'
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="userType">User Type</label>
            <select
            id="userType"
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            required
            >
            <option value="worker">Worker</option>
            <option value="employer">Employer</option>
            </select>
          </div>

          <button type="submit" className="signup-button">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;