import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginForm from './auth/Login';
import Signup from './auth/Signup';
import Navbar from './components/Navbar';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
    <Navbar/>
      {/* Define routes for login and signup pages */}
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path='/signup' element={<Signup/>} />
      </Routes>
    </Router>
  )
}

export default App
