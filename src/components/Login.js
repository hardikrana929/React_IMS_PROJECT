import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Signup_Url } from "../apiservices/SignupUrl";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  // Login code
  const handleLogin = () => {
    // validation
    if (!email || !pwd) {
      toast.error("Email and Password are required");
      return;
    }
    //fetch signup users
    axios.get(`${Signup_Url}/signup`)
      .then((response) => {
        const users = response.data;
        // match email and password
        const matchedUser = users.find(
          (u) => u.email === email && u.pwd === pwd
        );
        if (matchedUser) {
          toast.success("Login Successful");
          localStorage.setItem("KeepLogin", JSON.stringify(true))
          //STORE LOGIN SESSION
          localStorage.setItem(
            "loginUser",
            JSON.stringify({
              email: matchedUser.email,
              fname: matchedUser.fname,
              bname: matchedUser.bname,
              uid: matchedUser.uid
            })
          );
          navigate("/dashboard");
        } else {
          toast.error("Invalid Email or Password");
        }
      })
      .catch((error) => {
        toast.error("Server error, try again");
        console.error(error);
      });
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100 justify-content-center">
        <div className="col-11 col-sm-8 col-md-5 col-lg-4">
          <div className="card shadow border-0 rounded-4">
            <div className="card-body p-4">

              <div className="text-center mb-4">
                <i className="bi bi-shield-lock fs-1 text-primary"></i>
                <h4 className="fw-bold mt-2">Login to continue</h4>
              </div>

              {/* EMAIL */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"> <i className="bi bi-person"></i> </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <div className="input-group">
                  <div className="input-group">
                    <span className="input-group-text bg-white"> <i class="bi bi-lock"></i></span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Enter password"
                      value={pwd}
                      onChange={(e) => setPwd(e.target.value)}
                    />

                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <i class="bi bi-eye-slash"></i> : <i class="bi bi-eye"></i>}
                    </button>
                  </div>
                </div>
              </div>
              {/* Forgot password */}
              <div className="alert alert-light border d-flex align-items-center justify-content-between py-2 mb-3">
                <span className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Trouble logging in?
                </span>
                <Link to="/fpass" className="fw-semibold text-decoration-none">
                  Reset Password
                </Link>
              </div>

              <button
                className="btn btn-primary w-100 fw-semibold"
                onClick={handleLogin}
              >
                Login
              </button>

              <div className="text-center mt-3">
                <span>Don't have an account? </span>
                <Link to="/signup">Sign Up</Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
