import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Signup_Url } from "../apiservices/SignupUrl";
import axios from "axios";

const Signup = () => {

  const navigate = useNavigate();

  // Signup form state
  const [signup, setSignup] = useState({
    fname: "",
    bname: "",
    email: "",
    pwd: "",
    confirmPwd: ""
  });

  // Error state
  const [error, setError] = useState("");

  // Show / hide password
  const [showPwd, setShowPwd] = useState(false);

  // Input change handler
  const handleChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };

  // Page title
  useEffect(() => {
    document.title = "Signup";
  }, []);

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Password match validation
    if (signup.pwd !== signup.confirmPwd) {
      setError("Password and Confirm Password do not match");
      return;
    }

    setError("");

    // Post data to server
    postDataToServer({
      fname: signup.fname,
      bname: signup.bname,
      email: signup.email,
      pwd: signup.pwd
    });

    // Redirect to login
    navigate("/login");
  };

  // API call
  const postDataToServer = (data) => {
    axios.post(`${Signup_Url}/signupuser`, data).then(
      () => { console.log("Signup Success") },
      (error) => { console.log("Signup Error:", error) }
    );
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg border-0 rounded-4 w-100" style={{ maxWidth: "480px" }}>
        <div className="card-body p-4">

          {/* Header */}
          <div className="text-center mb-4">
            <i className="bi bi-person-plus-fill fs-1 text-success"></i>
            <h4 className="fw-bold mt-2">Create Account</h4>
            <p className="text-muted small">Start managing your inventory</p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-person"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  name="fname"
                  placeholder="Enter full name"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Business Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Business Name</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-building"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  name="bname"
                  placeholder="Enter business name"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Enter email"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type={showPwd ? "text" : "password"}
                  className="form-control"
                  name="pwd"
                  placeholder="Create password"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPwd(!showPwd)}
                >
                  <i className={`bi ${showPwd ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-shield-lock"></i>
                </span>
                <input
                  type="password"
                  className={`form-control ${error ? "is-invalid" : ""}`}
                  name="confirmPwd"
                  placeholder="Confirm password"
                  onChange={handleChange}
                  required
                />
                {error && <div className="invalid-feedback">{error}</div>}
              </div>
            </div>

            {/* Submit */}
            <button className="btn btn-success w-100 fw-semibold mt-2">
              <i className="bi bi-check-circle me-2"></i>
              Sign Up
            </button>

            {/* Login link */}
            <div className="text-center mt-3">
              <span className="text-muted">Already have an account?</span>{" "}
              <Link to="/login" className="fw-semibold text-decoration-none">
                Login
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
