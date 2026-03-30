import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import "./Register.scss";

const Register = () => {
  const { handleRegister, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    await handleRegister(form);
    navigate("/");
  };

  return (
    <div className="register">
      <div className="register__card">
        <h2 className="register__title">Create Account</h2>

        <form onSubmit={submitHandler} className="register__form">
          <input
            type="text"
            name="fname"
            placeholder="Full Name"
            value={form.fname}
            onChange={handleChange}
            className="register__input"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            className="register__input"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Create password"
            value={form.password}
            onChange={handleChange}
            className="register__input"
            required
          />

          <button
            type="submit"
            className="register__btn"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          {error && <p className="register__error">{error}</p>}
        </form>

        <p className="register__footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;