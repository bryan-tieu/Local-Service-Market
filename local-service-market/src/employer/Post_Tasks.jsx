import React, { useState } from "react";
import "./post_tasks.css";
import "bootstrap/dist/css/bootstrap.min.css";

const PostJobForm = () => {
  const [formData, setFormData] = useState({
    job_title: "",
    job_description: "",
    job_type: "",
    location: "",
    budget: "",
    deadline: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Job Posted:", formData);
  };

  return (
    <div className="post-job-container">
      <div className="post-job-form">
        <h1 id="post-title">Post a Job</h1>
        <hr className="title-divider" />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="job_title">Job Title</label>
            <input
              id="job_title"
              type="text"
              name="job_title"
              className="form-control"
              required
              value={formData.job_title}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="job_description">Job Description</label>
            <textarea
              id="job_description"
              name="job_description"
              className="form-control"
              required
              value={formData.job_description}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="job_type">Job Category</label>
            <select
              id="job_type"
              className="form-control"
              name="job_type"
              required
              value={formData.job_type}
              onChange={handleChange}
            >
              <option value="">Select a Category</option>
              <option value="carpentry">Carpentry</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="cleaning">Cleaning</option>
              <option value="gardening">Gardening</option>
              <option value="painting">Painting</option>
              <option value="other">Other</option>
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
            <input type="submit" className="btn btn-primary" value="Post Job" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobForm;
