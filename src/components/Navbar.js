import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">
          <svg className="brand-logo" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3.5C3 3.22386 3.22386 3 3.5 3H20.5C20.7761 3 21 3.22386 21 3.5V20.5C21 20.7761 20.7761 21 20.5 21H3.5C3.22386 21 3 20.7761 3 20.5V3.5Z" fill="currentColor"/>
            <path d="M5 7L19 7" stroke="#141414" strokeWidth="2" strokeLinecap="round"/>
            <path d="M5 12L19 12" stroke="#141414" strokeWidth="2" strokeLinecap="round"/>
            <path d="M5 17L15 17" stroke="#141414" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>BlogFlix</span>
        </Link>
      </div>
      <div className="nav-right">
        <Link to="/" className="nav-item">Home</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="nav-item">Dashboard</Link>
            <Link to="/blogs/create" className="nav-item">New</Link>
            <Link to="/profile" className="nav-item">Profile</Link>
            {user.role === "admin" && <Link to="/admin" className="nav-item">Admin</Link>}
            <button onClick={handleLogout} className="btn-link nav-item">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-item">Login</Link>
            <Link to="/register" className="nav-item btn btn-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}