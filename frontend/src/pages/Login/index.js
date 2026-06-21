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
  const [message,setMessage]=useState("");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmitForm = async e => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/api/auth/login",
        {
          email,
          password,
        }
      );

      Cookies.set(
        "jwt_token",
        response.data.token,
        {
          expires: 7,
        }
      );

      Cookies.set(
        "user_id",
        response.data.user.id,
        {
          expires: 7,
        }
      );

      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed")
    }
  };

  return (
    <div className="auth-container">
      <form
        className="auth-form"
        onSubmit={onSubmitForm}
      >
        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e =>
            {
  setEmail(e.target.value);
  setMessage("");
}
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e =>
            {
  setPassword(e.target.value);
  setMessage("");
}
          }
        />

        <button type="submit">
          Login
        </button>
        {message&&<p>{message}</p>}

        <p>
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;