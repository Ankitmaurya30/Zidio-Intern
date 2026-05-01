import React, { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  // ✅ Pre-fill credentials so you can test faster
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("demo123");
  const navigate = useNavigate();
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password }); // ✅ uses object, matches authService
      navigate("/dashboard");
    } catch (error) {
      // ✅ error handling adjusted for localStorage mock
      setErr(error.message || "Login failed");
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      {err && <div className="error">{err}</div>}
      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
