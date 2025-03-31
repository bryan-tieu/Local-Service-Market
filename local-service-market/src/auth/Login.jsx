import React, { useState } from "react";
import "./login.css";

const LoginForm = () => {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setUserId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId) {
      setError("User ID is required.");
    } else {
      setError(null);
      console.log("Logging in with User ID:", userId);
      // Add authentication logic here
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <p>User ID</p>
          <input type="text" name="user_id" value={userId} onChange={handleChange} />
          <input type="submit" value="Submit" />
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;