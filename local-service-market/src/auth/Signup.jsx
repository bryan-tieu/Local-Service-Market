import React, { useState, useCallback } from 'react';
import Input from 'react-phone-number-input/input';
import './Signup.css';
import './AuthLayout.css';

const Signup = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    userType: 'Worker'
  });

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); 
  }, []);

  // Handle phone number changes
  const handlePhoneChange = (value) => {
    setFormData(prev => ({
      ...prev,
      phoneNumber: value
    }));
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous error messages
    setError('');
    setSuccess(null);

    // Validate form data
    try {
        console.log('Form data:', formData);
        const response = await fetch('http://localhost:5000/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        // Handle failed signup
        if (!response.ok) {
          if (response.status === 409 && data.message.includes('already exists')) {
            setError('Email already exists. Please use a different email.');
          } else {
            setError(data.message || 'Something went wrong!');
          }
          return;
          }
        
          setSuccess(true);
            
        console.log('Signup successful:', data);

        setError('');

        // Reset form data
        setFormData({
            name: '',
            email: '',
            password: '',
            phoneNumber: '',
            userType: 'Worker'
            });
    } catch (error) {
        setError(error.message);
    }
    console.log('Form submitted:', formData);
  };

  return (
    <div className='auth-page-container main-content'>
      <div className="auth-form-container">
        <h2>Create Your Account</h2>
        {error && (
          <div className='error-message'>{error}</div>
        )}
        {success && (
          <div className="success-message">Signup Successful!</div>
        )}
        {!success && (
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
              <label htmlFor="phone-number">Phone Number</label>
              +1<Input
                country="US"
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                placeholder='Enter your phone number'
                international
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
              <option value="Worker">Worker</option>
              <option value="Employer">Employer</option>
              </select>
            </div>
  
            <button type="submit" className="signup-button">Sign Up</button>
          </form> 
        )}
      </div>
    </div>
  );
};

export default Signup;