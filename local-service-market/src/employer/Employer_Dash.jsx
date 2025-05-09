import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Employer_Dash.css';

const EmployerDashboard = ({ }) => {
  const navigate = useNavigate();

  useEffect(() => {
  
  // Check if the user is logged in to navigate to the employer home page
  const checkAuth = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/check-auth', {
                credentials: 'include',
            });

            const data = await response.json();

            // Navigate to login page if they haven't logged in
            if (!data.authenticated) {
                navigate('/login');
            }

        } catch (error) {
          navigate('/login');
        }
    };
    
    checkAuth();
}, []);

  return (
    <div className="employer-dashboard-container main-content">
      <h1>Employer Dashboard</h1>
      <p>Welcome! Select a tab to begin!</p>
    </div>
  );
};

export default EmployerDashboard;