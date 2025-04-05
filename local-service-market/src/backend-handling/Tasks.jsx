import React, { useState, useEffect } from 'react';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tasks', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();
        setTasks(data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const toggleTaskExpand = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const formatDeadline = (dateString) => {
    if (!dateString) return 'N/A';
    
    // Split the date string into parts (assuming format is DD-MM-YYYY)
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString; // Return original if format doesn't match
    
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    
    // Create a date object (months are 0-indexed in JavaScript)
    const date = new Date(year, month - 1, day);
    
    // Format the date as "Month Day, Year"
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="tasks-container">
      <h2>All Tasks</h2>
      <table className="tasks-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Deadline</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <React.Fragment key={task.id}>
              <tr 
                onClick={() => toggleTaskExpand(task.id)}
                className="task-row"
                style={{ cursor: 'pointer' }}
              >
                <td>{task.task_title}</td>
                <td>{formatDeadline(task.deadline)}</td>
              </tr>
              {expandedTaskId === task.id && (
                <tr className="expanded-details">
                  <td colSpan="2">
                    <div className="details-container">
                      <p><strong>ID:</strong> {task.id}</p>
                      <p><strong>Created:</strong> {task.date_created ? new Date(task.date_created).toLocaleString('en-US', {
                        timeZone: 'America/Los_Angeles',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      }) : 'N/A'}</p>
                      <p><strong>Description:</strong> {task.task_description}</p>
                      <p><strong>Type:</strong> {task.task_type}</p>
                      <p><strong>Location:</strong> {task.location}</p>
                      <p><strong>Budget:</strong> ${task.budget.toFixed(2)}</p>
                      <p><strong>User ID:</strong> {task.user_id}</p>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tasks;