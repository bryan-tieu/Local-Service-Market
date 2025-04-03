import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css'
import LoginForm from './auth/Login';
import Signup from './auth/Signup';
import Navbar from './components/Navbar';
import Users from './account/Users';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div className="app-container">
        <Navbar/>
        <div className="content-container">
          <Routes>
            <Route path='/login' element={<LoginForm />} />
            <Route path='/signup' element={<Signup/>} />
            <Route path='/users' element={<Users/>} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
