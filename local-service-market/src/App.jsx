import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginForm from './auth/Login';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div className="navigation-buttons">
        <Link to="/login">
          <button>Go to Login</button>
        </Link>
        <Link to="/signup">
          <button>Go to Sign Up</button>
        </Link>
      </div>
      {/* Define routes for login and signup pages */}
      <Routes>
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </Router>
  )
}

export default App
