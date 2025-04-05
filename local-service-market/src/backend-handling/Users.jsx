import React, { useState, useEffect } from 'react';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatPhoneNumber = (phoneNumber) => {

    // Check if phoneNumber is null or undefined
    if (!phoneNumber) return 'N/A';

    // Remove all non-digit characters
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
    return match ? `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}` : phoneNumber;
  };

  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');

        // Check if the response is ok (status code 200-299)
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="main-content">
      <div className="users-container">
        <h2>All Users</h2>
        <div className="user-cards">
          {users.map((user) => (
            <div className="user-card" key={user.id}>
              <div className="user-field">
                <strong>ID:</strong> {user.id}
              </div>
              <div className="user-field">
                <strong>Name:</strong> {user.name}
              </div>
              <div className="user-field">
                <strong>Email:</strong> {user.email}
              </div>
              <div className="user-field">
                <strong>Phone:</strong> {formatPhoneNumber(user.phone_number)}
              </div>
              <div className="user-field">
                <strong>Type:</strong> {user.user_type}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;