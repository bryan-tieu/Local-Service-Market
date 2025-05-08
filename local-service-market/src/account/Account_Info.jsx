import React, { useState, useEffect } from "react";
import './Account_Info.css';

const AccountInfo = ({ userData }) => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    skill_name: '',
    proficiency: '',  // Default value
    years_of_experience: "Years" // Default value
  });
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [expandedTransactionId, setExpandedTransactionId] = useState(null);

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

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
      }

      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions/received', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status}`);
      }
      const data = await response.json();
      setTransactions(data.transactions);
      console.log('Transactions data:', data); // Debug log
      console.log(data.transactions[0].amount);
      let total = 0;
      for (let i = 0; i < transactions.length; i++) {
        total += Number(data.transactions[i].amount);
      }
      console.log('Calculated balance:', total); // Debug log
      setBalance(total);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
      setBalance(0);
    }
  };

  const handleAddSkill = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill_name: newSkill.skill_name,
          proficiency: newSkill.proficiency,
          years_of_experience: newSkill.years_of_experience
        }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
      }

      if (response.ok) {
        const addedSkill = await response.json();
        setSkills([...skills, addedSkill.skill]);
        setNewSkill({
          skill_name: '',
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
      const response = await fetch(`http://localhost:5000/api/skills/${skillId}`, {
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
      fetchTransactions();
    }
  }, [userData]);

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
            {userData.userType === 'Worker' && (
              <p><strong>Account Balance:</strong> ${balance.toFixed(2)}</p>
            )}
          </div>
        ) : (
          <p>No user data available. Please log in.</p>
        )}
      </div>
        
      {userData?.userType === 'Worker' && (
        <>
          <div className="skills-container">
            <h1>Skills</h1>
            <div className="skill-input-container">
              <input
                id="skill-name"
                type="text"
                placeholder="Skill name (e.g., Plumbing)"
                value={newSkill.skill_name}
                onChange={(e) => setNewSkill({...newSkill, skill_name: e.target.value})}
              />

              <select
                id="skill-proficiency"
                value={newSkill.proficiency}
                onChange={(e) => setNewSkill({...newSkill, proficiency: parseInt(e.target.value)})}
              >
                {["Proficiency",1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>

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
                  <span><strong>{skill.skill_name.toUpperCase()}</strong></span>
                  <span><strong>Proficiency: </strong> {skill.proficiency}</span>
                  <span><strong>Years of Experience: </strong> {skill.years_of_experience}</span>
                  <button 
                    className="delete-skill-button"
                    onClick={() => handleDeleteSkill(skill.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="transactions-container">
  <h1>Transaction History</h1>
  <div className="transactions-list">
    {transactions.length > 0 ? (
      transactions.map(transaction => (
        <div
          key={transaction.id}
          className={`transaction-card ${expandedTransactionId === transaction.id ? 'expanded' : ''}`}
          onClick={() => setExpandedTransactionId(expandedTransactionId === transaction.id ? null : transaction.id)}
        >
          <div className="transaction-summary">
            <span className="transaction-title">{transaction.task?.task_title || 'No Task Title'}</span>
            <span className="transaction-amount">${transaction.amount.toFixed(2)}</span>
          </div>
          {expandedTransactionId === transaction.id && (
            <div className="transaction-details">
              <p><strong>Description:</strong> {transaction.description}</p>
              <p><strong>Status:</strong> {transaction.status}</p>
              <p><strong>Date:</strong> {new Date(transaction.timestamp).toLocaleString()}</p>
              {transaction.task && (
                <>
                  <p><strong>Task ID:</strong> {transaction.task.id}</p>
                  <p><strong>Task Budget:</strong> ${transaction.task.budget?.toFixed(2) || 'N/A'}</p>
                </>
              )}
            </div>
          )}
        </div>
      ))
    ) : (
      <p>No transactions yet</p>
    )}
  </div>
</div>
        </>
      )}
    </div>   
  );
}

export default AccountInfo;