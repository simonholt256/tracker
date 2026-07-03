import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user on refresh if token exists
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      axios.get("http://127.0.0.1:8000/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
    }
    setLoading(false);
  }, []);

  // SIGN UP
  const signUp = async ({ userName, email, password }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/users/signup",
        {
          user_name: userName,
          email,
          password
        }
      );

      return { success: true, data: response.data };
    } catch (error) {
      const backendMessage = error.response?.data?.detail;
      return { success: false, error: backendMessage || "Signup failed." };
    }
  };

  // SIGN IN
  const signIn = async (email, password) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        { email, password }
      );

      const token = response.data.access_token;
      localStorage.setItem("jwtToken", token);

      // Fetch user profile
      const userRes = await axios.get("http://127.0.0.1:8000/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(userRes.data);
      navigate("/home");

      return { success: true };
    } catch (error) {
      return { success: false, error: "Login failed. Check your email and password." };
    }
  };

  // SIGN OUT
  const signOut = () => {
    localStorage.removeItem("jwtToken");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
