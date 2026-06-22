import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";

import api from "../../api/axios";

import "./index.css";

const Login = () => {
  const navigate = useNavigate();

  const token = Cookies.get("jwt_token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmitForm = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      Cookies.set("jwt_token", response.data.token, {
        expires: 7,
      });

      Cookies.set("user_id", response.data.user.id, {
        expires: 7,
      });

      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={onSubmitForm}>
        <h1 className="login-heading">Login</h1>
        <label htmlFor="email" className="login-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="input-field"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setMessage("");
          }}
        />
        <label htmlFor="password" className="login-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="input-field"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setMessage("");
          }}
        />

        <button type="submit" className="login-button">
          Login
        </button>
        <p className="does-not-text">
          Don't have an account?{" "}
          <Link className="regiter-link" to="/register">
            Register
          </Link>
        </p>
        {message && <p className="error-message">{message}</p>}
      </form>
    </div>
  );
};

export default Login;
