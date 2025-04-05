import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Employer_Dash.css';

const EmployerDashboard = ({ }) => {
  const navigate = useNavigate();

  useEffect(() => {

    const checkAuth = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/check-auth', {
                credentials: 'include',
            });

            console.log("Auth check response:", response); // Debugging line
            const data = await response.json();
            console.log("Auth check data:", data); // Debugging line
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
      <p>This is the employer page</p>
    </div>
  );
};

export default EmployerDashboard;