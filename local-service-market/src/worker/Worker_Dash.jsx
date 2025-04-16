import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Worker_Dash.css';

const WorkerDashboard = ({ }) => {
  const navigate = useNavigate();

  useEffect(() => {

    const checkAuth = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/check-auth', {
                credentials: 'include',
            });

            const data = await response.json();
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
    <div className="worker-dashboard-container main-content">
      <h1>Worker Dashboard</h1>
      <p>This is the worker page</p>
    </div>
  );
};

export default WorkerDashboard;