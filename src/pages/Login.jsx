import React, { useEffect, useState } from "react";

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    handleLogin(email, password);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="relative h-screen w-screen flex items-center justify-center overflow-hidden bg-[#0f0f0f]">

      {/* FLOATING PARTICLES  */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <span
            key={i}
            className="absolute block w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* GLOW ORBS */}
      <div className="absolute top-[-150px] left-[-150px] w-[300px] h-[300px] bg-emerald-600 rounded-full blur-[160px] opacity-30"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[300px] h-[300px] bg-blue-600 rounded-full blur-[160px] opacity-30"></div>
      <div
        className={`
          relative w-[380px] bg-[#1c1c1c] p-10 rounded-2xl
          border border-gray-700 shadow-2xl backdrop-blur-xl z-10
          transition-all duration-700 ease-out
          animate-[pulse_4s_ease-in-out_infinite]
          ${show ? "opacity-100 rotate-y-0 scale-100" : "opacity-0 rotate-y-90 scale-75"}
        `}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Login to continue to your dashboard
        </p>

        <form onSubmit={submitHandler} className="flex flex-col gap-5">
          {/* Email */}
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              placeholder="admin@example.com"
              className="w-full mt-1 px-4 py-3 rounded-lg bg-black text-white border border-gray-600 outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              placeholder="Enter password"
              className="w-full mt-1 px-4 py-3 rounded-lg bg-black text-white border border-gray-600 outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg text-lg font-semibold transition"
          >
            Login
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          Admin & Employee Secure Login
        </p>
      </div>
    </div>
  );
};

export default Login;
