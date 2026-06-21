import { useState } from "react";
import {
  Navigate,
  useNavigate,
  Link,
} from "react-router-dom";

import Cookies from "js-cookie";

import api from "../../api/axios";

import "./index.css";

const Register = () => {
  const navigate = useNavigate();

  const token = Cookies.get("jwt_token");

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

const [message,setMessage]=useState("")

  if (token) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  const onSubmitForm = async e => {
    e.preventDefault();

    try {
      await api.post(
        "/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      navigate("/");
    } catch (error) {
      setMessage(
        error.response?.data?.message
      );
    }
  };

  return (
    <div className="auth-container">
      <form
        className="auth-form"
        onSubmit={onSubmitForm}
      >
        <h1>Register</h1>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e =>{
            setName(e.target.value)
            setMessage("")}
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e =>{
            setEmail(e.target.value)
            setMessage("")}
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e =>{
            setPassword(
              e.target.value
            )
            setMessage("")
          }}
        />

        <button type="submit">
          Register
        </button>
        {message&&<p>{message}</p>}

        <p>
          Already have account?{" "}
          <Link to="/">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;