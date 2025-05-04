import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaskMap from '../components/TaskMap';
import './Worker_Dash.css';

const WorkerDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/check-auth', {
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
      <div className="map-section">
        <TaskMap />
      </div>
    </div>
  );
};

export default WorkerDashboard;
