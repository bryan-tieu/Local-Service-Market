import React, { useState } from "react";
import "./Post_Tasks.css";
import { set } from "date-fns";

const PosttaskForm = () => {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    task_title: "",
    task_description: "",
    task_type: "",
    location: "",
    budget: "",
    deadline: ""
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {

    // Reset the page
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validate form data
    try {
      // Fetch from api
      const response = await fetch('http://localhost:5000/api/post_task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      // Handle failed task posting
      if (!response.ok) {
        setError(data.message || 'Something went wrong!');
        return;
      }

      //console.log('Task posted successfully:', data);

      setSuccessMessage('Task posted successfully!');
      setError('');

      // Reset form data
      setFormData({
        task_title: "",
        task_description: "",
        task_type: "",
        location: "",
        budget: "",
        deadline: ""
      });

      // 5 Second timer to remove success message
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
    } catch (error) {
      console.error('Error posting task:', error);
      setError('Error posting task. Please try again later.');
    }
    
    // console.log('Form submitted:', formData);
  };

  return (
    <div className="post-task-container main-content">
      <div className="post-task-form-container">
        <h2 id="post-title">Post a Task</h2>
        <hr className="title-divider" />
        {/* Display success message if it exists */}
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        {/* Display error message if it exists */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="post-task-form">
          <div className="form-group">
            <label htmlFor="task_title">Task Title</label>
            <input
              id="task_title"
              type="text"
              name="task_title"
              className="form-control"
              required
              value={formData.task_title}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="task_description">Task Description</label>
            <textarea
              id="task_description"
              name="task_description"
              className="form-control"
              required
              value={formData.task_description}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="task_type">Task Category</label>
            <select
              id="task_type"
              className="form-control"
              name="task_type"
              required
              value={formData.task_type}
              onChange={handleChange}
            >
              <option value="">Select a Category</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Gardening">Gardening</option>
              <option value="Painting">Painting</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              name="location"
              className="form-control"
              required
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="budget">Budget</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                id="budget"
                type="number"
                name="budget"
                className="form-control"
                required
                value={formData.budget}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="deadline">Deadline</label>
            <input
              id="deadline"
              type="date"
              name="deadline"
              className="form-control"
              required
              value={formData.deadline}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <button type="submit" className="post-task-button">Post task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PosttaskForm;
