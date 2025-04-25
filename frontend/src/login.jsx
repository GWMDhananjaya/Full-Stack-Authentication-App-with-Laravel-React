import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Using Bootstrap for basic styling
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      console.log("Response:", response.data);
      if (response.data.token && response.data.user) {
        setSuccess("Login successful!");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard");
      } else {
        setError("Invalid login response. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      if (err.response) {
        setError(err.response.data.error || "Login failed. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 ">
      <div
        className="card p-10 shadow pad"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-3 input-group">
            <span className="input-group-text bg-light">
              <FaEnvelope style={{ color: "#901DF4" }} />
            </span>
            <input
              type="email"
              className="form-control"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-3 input-group">
            <span className="input-group-text bg-light">
              <FaLock style={{ color: "#901DF4" }} />
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 mt-3"
            disabled={loading}
            style={{ color: "white", backgroundColor: "#901DF4" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {success && <div className="alert alert-success mt-3">{success}</div>}
        </form>
        <div className="mt-4 text-center">
          <p>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#901DF4" }}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
