import React from "react";
import { Link } from "react-router-dom";

const EmployerDashboard = () => {
  return (
    <div>
      <h1>Employer Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/post_task">Post</Link></li>
          <li><Link to="/list_tasks">Tasks</Link></li>
          <li><Link to="/account_info">Account</Link></li>
          <li><Link to="/messages">Messages</Link></li>
        </ul>
      </nav>
      <p>This is the employer page</p>
    </div>
  );
};

export default EmployerDashboard;