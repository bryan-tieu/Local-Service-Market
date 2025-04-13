import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css'
import LoginForm from './auth/Login';
import Signup from './auth/Signup';
import Navbar from './components/Navbar';
import Users from './backend-handling/Users';
import EmployerDashboard from './employer/Employer_Dash';
import WorkerDashboard from './worker/Worker_Dash';
import AccountInfo from './account/Account_Info';
import PostJobForm from './employer/Post_Tasks';
import Tasks from './components/Tasks';                          

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [count, setCount] = useState(0)
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
  }

  const handleLogout = async () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  }
  
  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/check-auth', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        // Handle unauthorized access
        if (response.status === 401) {
          setIsAuthenticated(false);
          setCurrentUser(null);
          return;
        }
        
        const data = await response.json();
        
        // Update authentication state based on response
        if (data.authenticated) {
          setIsAuthenticated(true);
          setCurrentUser(data.user); 
        } else{
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setCurrentUser(null);
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
            <Route path='/account' element={<AccountInfo userData={currentUser}/>} />
            <Route path='/post_tasks' element={<PostJobForm/>} />
            <Route path='/tasks' element={<Tasks findAll={false}/>} />
            <Route path='/find_tasks' element={<Tasks findAll={true}/>} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
