import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { parse, format } from 'date-fns';
import TaskMap from '../worker/TaskMap';
import './Tasks.css';

const Tasks = (props) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [userType, setUserType] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All'); 
  const location = useLocation();

  const fetchTasks = async () => {
    try {

      let endpoint = props.findAll
      ? 'http://localhost:5000/api/find_tasks'
      : 'http://localhost:5000/api/tasks';

      const url = new URL(endpoint);

      if (statusFilter !== 'All') {
        url.searchParams.append('status', statusFilter);
      }
      console.log("Fetching tasks from:", url.toString()); // Debugging line

      const response = await fetch(url.toString(), {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData); // Debugging line
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      console.log("Response data:", data); // Debugging line
      setTasks(data);

    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/check-auth', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUserType(data.user?.userType);

    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUserData();
  }, [props.findAll, statusFilter]);

  const handleAcceptJob = async () => {
    if (!selectedTask) return;
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${selectedTask.id}/accept`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
    });

    } catch (error) {
      console.error('Error accepting job:', error);
    }
    fetchTasks();
  };

  const handleCompleteJob = async () => {
    if (!selectedTask) return;
    try {
      const response = await fetch(`http://localhost:5000/api/complete-task/${selectedTask.id}/complete`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error completing job:', errorData);
        throw new Error(errorData.error || 'Failed to complete job');
      }

      const result = await response.json();
      console.log('Job completed and payment initiated:', result);
      alert('Job completed successfully! Payment has been initiated.');
      fetchTasks();
    } catch (error) {
      console.error('Error completing job:', error);
      alert(`Error: ${error.message}`);
    }
};

  const handleTaskClick = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
    setSelectedTask(tasks.find(task => task.id === taskId));
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

  
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="main-content">
      <div className="tasks-container">
        <h2>My Tasks</h2>
        {!props.findAll && (
          <div className="filter-container">
            <div className="task-filters">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Tasks</option>
                  <option value="Completed">Completed</option>
                  <option value="Incomplete">Incomplete</option>
                </select>
            </div>
          </div>
        )}

        <div className="tasks-list">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`task-card ${expandedTaskId === task.id ? 'expanded' : ''}`}
              onClick={() => handleTaskClick(task.id)}
            >
              <div className="task-summary">
                <span className="task-title">{task.task_title}</span>
                <span className="task-deadline">{formatDeadline(task.deadline)}</span>
              </div>
              {expandedTaskId === task.id && (
                <div className="task-details">
                  <p><strong>Employer:</strong> {task.employer_name}</p>
                  <p><strong>Employer ID:</strong> {task.user_id}</p>
                  <p><strong>Created:</strong> {task.date_created ? new Date(task.date_created).toLocaleString('en-US', {
                    timeZone: 'America/Los_Angeles',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  }) : 'N/A'}</p>
                  <p><strong>Status:</strong> {task.status}</p>
                  <p><strong>Worker:</strong> {task.worker_name}</p>
                  <p><strong>Worker ID:</strong> {task.worker_id}</p>
                  <p><strong>Description:</strong> {task.task_description}</p>
                  <p><strong>Type:</strong> {task.task_type}</p>
                  <p><strong>Location:</strong> {task.location}</p>
                  <p><strong>Budget:</strong> ${task.budget.toFixed(2)}</p>
                  {userType === 'Worker' && task.status === 'Open' && (
                    <button
                      onClick={handleAcceptJob}
                      className="apply-button"
                      >Accept</button>
              )}
                  {userType === 'Worker' && task.status === 'Assigned' && (
                    <button
                      onClick={handleCompleteJob}
                      className="complete-button"
                      >Complete</button>
                  ) }
                </div>
              )}
            </div>
          ))}
        </div>
        </div>
        {userType === 'Worker' && location.pathname === '/find_tasks' && (
          <div className="map-section">
          <div className="map-header">
            <h2>Available Tasks</h2>
            </div>
          <TaskMap />
          </div>
        )}
    </div>
  );
};

export default Tasks;
