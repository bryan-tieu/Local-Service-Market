import React, { useState, useEffect } from 'react';
import './Tasks.css'; // We'll create this CSS file

// Tasks component to fetch and display all tasks
const Tasks = () => {
  // State variables to manage tasks, loading state, and error state
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect hook to fetch tasks from the API when the component mounts
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
        
        // Check if the response is ok (status code 200-299)
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        // Parse the response data as JSON
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

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="tasks-container">
      <h2>All Tasks</h2>
      <table className="tasks-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Created</th>
            <th>Title</th>
            <th>Description</th>
            <th>Type</th>
            <th>Location</th>
            <th>Budget</th>
            <th>Deadline</th>
            <th>User ID</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>
                {task.date_created ? new Date(task.date_created).toLocaleString('en-US', {
                  timeZone: 'America/Los_Angeles',
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                }) : 'N/A'}
              </td>
              <td>{task.task_title}</td>
              <td>{task.task_description}</td>
              <td>{task.task_type}</td>
              <td>{task.location}</td>
              <td>${task.budget.toFixed(2)}</td>
              <td>{task.deadline}</td>
              <td>{task.user_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tasks;