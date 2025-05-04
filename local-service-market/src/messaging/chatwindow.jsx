import React, { useState, useEffect } from 'react';
import './Chat_Window.css'; 

function ChatWindow() {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userFilter, setUserFilter] = useState('All');

  // Load users and messages when we mount
  useEffect(() => {
    fetchUsers();
    fetchMessages();
  }, [userFilter]);

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:5000/api/users', {
      credentials: 'include'
    });

    if (!res.ok) throw new Error('Could not load users');
    const data = await res.json();
    setUsers(data);
    if (data.length) setReceiverId(data[0].id);  // default to first user
  };

  const fetchMessages = async () => {
    const url = userFilter !== 'all' 
        ? `http://localhost:5000/api/messages?user=${userFilter}`
        : 'http://localhost:5000/api/messages';
        
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Could not load messages');
    const data = await res.json();
    setMessages(data);
  };
  

  const sendMessage = async () => {
    if (!receiverId || !text.trim()) return;

    await fetch('http://localhost:5000/api/messages', {
      method: 'POST',
      credentials: 'include', // <-- send the session cookie
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        receiver_id: receiverId, // <-- backend expects receiver_id
        text: text.trim() 
      }),
    });
    setText('');
    fetchMessages(); // reload
  };

  return (
    <div className="chat-container main-content">
      <div className="chat-form-container">
        <h2 className="chat-title">Messages</h2>
        <hr className="title-divider" />

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="chat-form">
          <div className="form-group">
            <label htmlFor="receiver-select">Send To:</label>
            <select 
              id="receiver-select"
              value={receiverId} 
              onChange={e => setReceiverId(e.target.value)}
              className="form-control"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message-text">Message:</label>
            <textarea
              id="message-text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Write a message..."
              className="form-control"
            />
          </div>

          <div className="form-group">
            <button 
              onClick={sendMessage} 
              className="chat-button"
              disabled={!text.trim() || !receiverId}
            >
              Send Message
            </button>
          </div>

          <div className="form-group">
            <h3 style={{ color: '#000' }}>Message History</h3>
            <div className="filter-container">
              <div className="task-filters">
                <select
                  value={userFilter} 
                  onChange={e => setUserFilter(e.target.value)}
                >
                  <option value="All">All Users</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <ul className="message-history">
              {messages.map(msg => (
                <li key={msg.id} className="message-item">
                  <div className="message-header">
                    {msg.sender_name} ➝ {msg.receiver_name}
                  </div>
                  <div className="message-content">{msg.text}</div>
                  <div className="message-timestamp">
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
