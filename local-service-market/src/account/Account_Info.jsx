import React from "react";

const AccountInfo = ({ userData }) => {

  const formatUserId = (userId, userType) => {
    if (userType === 'Employer') {
      // Add leading zero for Employer
      return userId.toString().padStart(8, '0');
    }
    return userId;
  };

  return (
    <div className="account-info-container main-content">
      <h1>Account Information</h1>
      {userData ? (
        <div className="user-details">
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>User ID:</strong> {formatUserId(userData.id, userData.userType)}</p>
          <p><strong>Account Type:</strong> {userData.userType}</p>
        </div>
      ) : (
        <p>No user data available. Please log in.</p>
      )}
    </div>
  );
};

export default AccountInfo;