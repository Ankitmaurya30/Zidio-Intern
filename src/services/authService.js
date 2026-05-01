// src/services/authService.js
import api from "../api/axiosConfig";

export async function register({ name, email, password }) {
  try {
    const response = await api.post("/auth/signup", { name, email, password });
    const { token, user } = response.data;
    
    // Save user data in localStorage
    const userData = { ...user, token };
    localStorage.setItem("user", JSON.stringify(userData));
    
    return userData;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Registration failed");
  }
}

export async function login({ email, password }) {
  try {
    const response = await api.post("/auth/login", { email, password });
    const { token, user } = response.data;
    
    // Save user data in localStorage
    const userData = { ...user, token };
    localStorage.setItem("user", JSON.stringify(userData));
    
    return userData;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Login failed");
  }
}

export async function logout() {
  try {
    // No need to call the backend for logout as JWT is stateless
    // Just remove the token from localStorage
    localStorage.removeItem("user");
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
}
