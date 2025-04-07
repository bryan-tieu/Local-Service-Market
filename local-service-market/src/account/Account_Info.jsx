import React, { useState, useEffect } from "react";
import './Account_Info.css';

const AccountInfo = ({ userData }) => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    name: '',
    proficiency: 5,  // Default value
    years_of_experience: 1
  });

  // Function to format phone numbers
  const formatPhoneNumber = (phoneNumber) => {

    // Remove all non-digit characters
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    
    // Apply formatting
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);

    // Check if the match is valid
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
    }

    return phoneNumber; 
  };

  // Function to format user ID (for employers to pad with leading zero)
  const formatUserId = (userId, userType) => {
    if (userType === 'Employer') {

      // Add leading zero for Employer
      return userId.toString().padStart(8, '0');
    }

    return userId;
  };
  
  const fetchSkills = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/skills', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) {
      alert('Please enter a skill name');
      return;
    }

    console.log('Payload:', payload); // Debugging line
    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSkill.name,
          proficiency: newSkill.proficiency,
          years_of_experience: newSkill.years_of_experience
        }),
        credentials: 'include'
      });
      
      if (response.ok) {
        const addedSkill = await response.json();
        setSkills([...skills, addedSkill.skill]);
        setNewSkill({
          name: '',
          proficiency: 5,
          years_of_experience: 1
        });
      }
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      const response = await fetch(`/api/skills/${skillId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        setSkills(skills.filter(skill => skill.id !== skillId));
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  useEffect(() => {
    if (userData?.userType === 'Worker') {
      fetchSkills();
    }

    console.log('Current newSkill state:', newSkill); // Debugging line
  }, [newSkill]);

  return (
    <div className="main-content">
      <div className="account-info-container">
      <h1>Account Information</h1>
      {userData ? (
        <div className="user-details">
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Phone:</strong> {formatPhoneNumber(userData.phone_number)}</p>
        <p><strong>User ID:</strong> {formatUserId(userData.id, userData.userType)}</p>
        <p><strong>Account Type:</strong> {userData.userType}</p>
        </div>
        ) : (
          <p>No user data available. Please log in.</p>
          )}
          </div>
      
      {userData?.userType === 'Worker' && (
        <div className="skills-container">
          <h1>Skills</h1>
          <div className="skill-input-container">
            {/* Skill Name */}
            <input
              id="skill-name"
              type="text"
              placeholder="Skill name (e.g., Plumbing)"
              value={newSkill.name}
              onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
            />

            {/* Proficiency (Dropdown 1-10) */}
            <select
              id="skill-proficiency"
              value={newSkill.proficiency}
              onChange={(e) => setNewSkill({...newSkill, proficiency: parseInt(e.target.value)})}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>

            {/* Years of Experience (Number Input) */}
            <input
              id="skill-years"
              type="number"
              min="0"
              step="0.5"
              placeholder="Years"
              value={newSkill.years_of_experience}
              onChange={(e) => setNewSkill({...newSkill, years_of_experience: parseFloat(e.target.value) || 0})}
            />

            <button onClick={handleAddSkill}>Add Skill</button>
          </div>
          <div className="skills-list">
            {skills.map(skill => (
              <div key={skill.id} className="skill-item">
                <span>{skill.name}</span>
                <button 
                  className="delete-skill-button"
                  onClick={() => handleDeleteSkill(skill.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}    
    </div>
  );
};

export default AccountInfo;