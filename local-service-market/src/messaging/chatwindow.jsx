import React, { useState, useEffect } from 'react';

function ChatWindow() {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState('');
  const [text, setText] = useState('');

  // Load users and messages when we mount
  useEffect(() => {
    fetchUsers();
    fetchMessages();
  }, []);

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
    const res = await fetch('http://localhost:5000/api/messages', {
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
    <div style={{ padding: '20px' }}>
      <h2>Messaging</h2>

      <label>
        Send To:
        <select 
          value={receiverId} 
          onChange={e => setReceiverId(e.target.value)}
        >
          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.id})
            </option>
          ))}
        </select>
      </label>

      <div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write a message..."
          rows="4"
          cols="40"
        />
      </div>

      <button onClick={sendMessage}>Send</button>

      <h3>Messages</h3>
      <ul>
        {messages.map(msg => (
          <li key={msg.id}>
            <strong>
              {msg.sender_name} ➝ {msg.receiver_name}
            </strong>
            : {msg.text}{' '}
            <em>({new Date(msg.timestamp).toLocaleString()})</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatWindow;
