import React, { useState, useEffect } from 'react';
import './Display.css'; // Reuse your existing CSS

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/get_all_tasks');

        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        } 
        const data = await response.json();
        console.log("Response data:", data); // Debugging line

        setTasks(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <div className="loading">Loading tasks...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="main-content">
      <div className="users-container"> {/* Reusing users container styles */}
        <h2>All Tasks</h2>
        <div className="user-cards"> {/* Reusing user-cards grid */}
          {tasks.map((task) => (
            <div className="user-card" key={task.id}> {/* Reusing card style */}
              <div className="user-field">
                <strong>Title:</strong> {task.task_title}
              </div>
              <div className="user-field">
                <strong>Status:</strong> {task.status}
              </div>
              <div className="user-field">
                <strong>Employer:</strong> {task.employer_name}
              </div>
              <div className="user-field">
                <strong>Employer ID:</strong> {task.employer_id}
                </div>
                <div className="user-field">
                <strong>Worker:</strong> {task.worker_name}
                </div>
                <div className="user-field">
                <strong>Worker ID:</strong> {task.worker_id}
                </div>
              {task.worker && (
                <div className="user-field">
                  <strong>Worker:</strong> {task.worker.name}
                </div>
              )}
              <div className="user-field">
                <strong>Budget:</strong> ${task.budget.toFixed(2)}
              </div>
              <div className="user-field">
                <strong>Deadline:</strong> {formatDate(task.deadline)}
              </div>
              <div className="user-field">
                <strong>Created:</strong> {formatDate(task.date_created)}
              </div>
              <div className="user-field">
                <strong>Location:</strong> {task.location}
              </div>
              <div className="user-field">
                <strong>Type:</strong> {task.task_type}
              </div>
              <div className="user-field description">
                <strong>Description:</strong> {task.task_description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllTasks;