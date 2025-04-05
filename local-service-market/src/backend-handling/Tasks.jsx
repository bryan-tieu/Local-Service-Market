import React, { useState, useEffect } from 'react';
import { parse, format } from 'date-fns';
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
    
    try {
      // Try multiple date formats
      const possibleFormats = [
        'dd-MM-yyyy',
        'MM/dd/yyyy',
        'dd/MM/yyyy',
        'yyyy-MM-dd'
      ];
      
      let parsedDate;
      for (const fmt of possibleFormats) {
        parsedDate = parse(dateString, fmt, new Date());
        if (!isNaN(parsedDate.getTime())) break;
      }
      
      if (isNaN(parsedDate.getTime())) return dateString;
      
      return format(parsedDate, 'MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="main-content">
      <div className="tasks-container">
        <h2>All Tasks</h2>
        <div className="tasks-list">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className={`task-card ${expandedTaskId === task.id ? 'expanded' : ''}`}
              onClick={() => toggleTaskExpand(task.id)}
            >
              <div className="task-summary">
                <span className="task-title">{task.task_title}</span>
                <span className="task-deadline">{formatDeadline(task.deadline)}</span>
              </div>
              {expandedTaskId === task.id && (
                <div className="task-details">
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
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;