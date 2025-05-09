import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './TaskMap.css';

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const taskIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DEFAULT_POSITION = {
  lat: 48.8566,
  lng: 2.3522
};

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const TaskMap = () => {
  const [userPosition, setUserPosition] = useState(DEFAULT_POSITION);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    if (navigator.geolocation) {
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 5000);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLoading(false);
        },
        (error) => {
          clearTimeout(timeoutId);
          console.error('Geolocation error:', error);
          setUserPosition(DEFAULT_POSITION);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/find_tasks', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error fetching tasks');
        }

        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.error('Error in fetchTasks:', err);
        setError(err.message);
      }
    };

    fetchTasks();
  }, []);

  const handleAcceptJob = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/accept`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const fetchTasks = async () => {
          try {
            const response = await fetch('http://localhost:5000/api/find_tasks', {
              credentials: 'include',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            });
            const data = await response.json();
            setTasks(data);
          } catch (err) {
            console.error('Error refreshing tasks:', err);
          }
        };
        fetchTasks();
      } else {
        throw new Error('Failed to accept job');
      }
    } catch (error) {
      console.error('Error accepting job:', error);
      setError('Failed to accept the job. Please try again.');
    }
  };

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="map-container">
      {isLoading && <div className="loading-overlay">Getting your location...</div>}
      <MapContainer
        center={userPosition}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={userPosition} zoom={13} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker position={userPosition} icon={userIcon}>
          <Popup>Your position</Popup>
        </Marker>

        {tasks.map((task) => (
          <Marker
            key={task.id}
            position={[task.latitude, task.longitude]}
            icon={taskIcon}
          >
            <Popup>
              <div className="task-popup">
                <h3>{task.task_title}</h3>
                <div className="task-info">
                  <p><strong>Employer:</strong> {task.employer_name || 'N/A'}</p>
                  <p><strong>Employer ID:</strong> {task.user_id || 'N/A'}</p>
                  <p><strong>Created:</strong> {task.date_created ? new Date(task.date_created).toLocaleString('en-US', {
                    timeZone: 'America/Los_Angeles',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  }) : 'N/A'}</p>
                  <p><strong>Deadline:</strong>{task.deadline}</p>
                  <p><strong>Status:</strong> {task.status || 'N/A'}</p>
                  <p><strong>Worker:</strong> {task.worker_name || 'N/A'}</p>
                  <p><strong>Worker ID:</strong> {task.worker_id || 'N/A'}</p>
                  <p><strong>Description:</strong> {task.task_description || 'N/A'}</p>
                  <p><strong>Type:</strong> {task.task_type || 'N/A'}</p>
                  <p><strong>Location:</strong> {task.location || 'N/A'}</p>
                  <p><strong>Budget:</strong> ${task.budget?.toFixed(2) || '0.00'}</p>
                </div>
                {task.status === 'Open' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcceptJob(task.id);
                    }}
                    className="task-button"
                  >
                    Accept
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default TaskMap;
