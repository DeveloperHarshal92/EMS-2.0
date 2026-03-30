import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";

const Login = () => {
  const { handleLogin, isLoading, error } = useAuth();
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submitHandler = (e) => {
    e.preventDefault();
    handleLogin(form);
    navigate("/")
  };

  console.log(error)

  return (
    <div className="login">
      <form onSubmit={submitHandler} className="login__card">
        <h2 className="login__title">Login</h2>

        <input
          className="login__input"
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          className="login__input"
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="login__btn" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="login__error">{error}</p>}

        <p className="login__link">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;