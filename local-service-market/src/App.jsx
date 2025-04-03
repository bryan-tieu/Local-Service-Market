import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css'
import LoginForm from './auth/Login';
import Signup from './auth/Signup';
import Navbar from './components/Navbar';
import Users from './account/Users';
import EmployerDashboard from './employer/Employer_Dash';
import WorkerDashboard from './worker/Worker_Dash';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [count, setCount] = useState(0)
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  }
  
  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/check-auth', {
          headers: {
            'Accept': 'application/json' // Explicitly ask for JSON
          }
        });
  
        // First check if response is HTML
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.log('Received non-JSON response, likely HTML');
          setIsAuthenticated(false);
          return;
        }
  
        const data = await response.json();
        
        if (response.ok) {
          setIsAuthenticated(true);
          setCurrentUser(data.user || data); // Handle both response formats
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Navbar
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
          userType={currentUser && currentUser.userType}
        />
        <div className="content-container">
          <Routes>
            <Route path='/login' element={<LoginForm onLogin={handleLogin} />} />
            <Route path='/signup' element={<Signup/>} />
            <Route path='/users' element={<Users/>} />
            <Route path='/employer-dashboard' element={<EmployerDashboard/>} />
            <Route path='/worker-dashboard' element={<WorkerDashboard/>} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
