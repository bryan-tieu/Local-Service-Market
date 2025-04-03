import React, { useState, useEffect } from 'react';
import './Users.css';

// Users component to fetch and display all users
const Users = () => {
  
  // State variables to manage users, loading state, and error state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect hook to fetch users from the API when the component mounts
  useEffect(() => {

    // Function to fetch users from the API
    const fetchUsers = async () => {

      try {
        const response = await fetch('http://localhost:5000/api/users');


        // Check if the response is ok (status code 200-299)
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        // Parse the response data as JSON
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

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="users-container">
      <h2>All Users</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>User Type</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.user_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;