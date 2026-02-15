import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Signup_Url } from "../apiservices/SignupUrl";

const ForgotPass = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const handleReset = () => {
    //Validation
    if (!email || !newPwd || !confirmPwd) {
      toast.error("All fields are required");
      return;
    }
    if (newPwd !== confirmPwd) {
      toast.error("Passwords do not match");
      return;
    }
    // Fetch users and update password
    axios.get(`${Signup_Url}/signup`)
      .then((response) => {
        const users = response.data;
        const userIndex = users.findIndex((u) => u.email === email);
        if (userIndex !== -1) {
          // Update password
          axios.put(`${Signup_Url}/signup`, {
            ...users[userIndex],
            pwd: newPwd
          })
            .then(() => {
              toast.success("Password reset successful");
              navigate("/login");
            })
            .catch((err) => {
              toast.error("Server error, try again");
              console.error(err);
            });
        } else {
          toast.error("Email not found");
        }
      })
      .catch((err) => {
        toast.error("Server error, try again");
        console.error(err);
      });
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100 justify-content-center">
        <div className="col-11 col-sm-8 col-md-5 col-lg-4">
          <div className="card shadow border-0 rounded-4">
            <div className="card-body p-4">

              <div className="text-center mb-4">
                <i className="bi bi-key-fill fs-1 text-primary"></i>
                <h4 className="fw-bold mt-2">Reset Password</h4>
                <p className="text-muted">Enter your email and new password</p>
              </div>

              {/* EMAIL */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-envelope-fill"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* NEW PASSWORD */}
              <div className="mb-3">
                <label className="form-label fw-semibold">New Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter new password"
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <i className="bi bi-eye-slash"></i>
                    ) : (
                      <i className="bi bi-eye"></i>
                    )}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Confirm Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  <input
                    type={showConfirm ? "text" : "password"}
                    className="form-control"
                    placeholder="Confirm new password"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? (
                      <i className="bi bi-eye-slash"></i>
                    ) : (
                      <i className="bi bi-eye"></i>
                    )}
                  </button>
                </div>
              </div>

              <button
                className="btn btn-primary w-100 fw-semibold"
                onClick={handleReset}
              >
                Reset Password
              </button>
              <div className="text-center"><Link to="/login">Go to Login</Link></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPass;
