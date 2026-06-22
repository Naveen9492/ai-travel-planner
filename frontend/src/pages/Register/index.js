import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";

import Cookies from "js-cookie";

import api from "../../api/axios";

import "./index.css";

const Register = () => {
  const navigate = useNavigate();

  const token = Cookies.get("jwt_token");

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmitForm = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={onSubmitForm}>
        <h1 className="register-heading">Register</h1>
        <label htmlFor="name" className="register-label">
          Name
        </label>
        <input
          type="text"
          id="name"
          className="input-field"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setMessage("");
          }}
        />
        <label htmlFor="email" className="register-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="input-field"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setMessage("");
          }}
        />
        <label htmlFor="password" className="register-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="input-field"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setMessage("");
          }}
        />

        <button type="submit" className="register-button">
          Register
        </button>
        <p className="does-not-text">
          Already have account?{" "}
          <Link to="/" className="login-link">
            Login
          </Link>
        </p>
        {message && <p className="error-message">{message}</p>}
      </form>
    </div>
  );
};

export default Register;
