import React from "react";
import './Account_Info.css';

const AccountInfo = ({ userData }) => {

  // Function to format phone numbers
  const formatPhoneNumber = (phoneNumber) => {

    // Remove all non-digit characters
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    
    // Apply formatting
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);

    // Check if the match is valid
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
    }

    return phoneNumber; 
  };

  // Function to format user ID (for employers to pad with leading zero)
  const formatUserId = (userId, userType) => {
    if (userType === 'Employer') {

      // Add leading zero for Employer
      return userId.toString().padStart(8, '0');
    }

    return userId;
  };

  return (
    <div className="main-content">
      <div className="account-info-container">
      <h1>Account Information</h1>
      {userData ? (
        <div className="user-details">
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Phone:</strong> {formatPhoneNumber(userData.phone_number)}</p>
        <p><strong>User ID:</strong> {formatUserId(userData.id, userData.userType)}</p>
        <p><strong>Account Type:</strong> {userData.userType}</p>
        </div>
        ) : (
          <p>No user data available. Please log in.</p>
          )}
          </div>

      <div className="skills-container">
          <h1>Skills</h1>

      </div>
    </div>
  );
};

export default AccountInfo;