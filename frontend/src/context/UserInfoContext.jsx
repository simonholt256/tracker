import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const API = import.meta.env.VITE_API_URL;

export const UserInfoContext = createContext();

export function UserInfoProvider({ children }) {
  const { user: authUser } = useContext(AuthContext); 
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState(null);

  // Fetch user details
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      const res = await axios.get(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(res.data);
      setErrorUser(null);
    } catch (err) {
      setErrorUser("Failed to load user details.");
    } finally {
      setLoadingUser(false);
    }
  };

  // Update user details
  const updateUser = async (updates) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token || !user?.id) return;

      const res = await axios.put(
        `${API}/users/${user.id}`,
        updates,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUser(res.data);
      return { success: true };
    } catch (err) {
      return { success: false, error: "Failed to update user." };
    }
  };

  // Load user when AuthContext loads
  useEffect(() => {
    if (authUser) {
      fetchUser();
    }
  }, [authUser]);

  return (
    <UserInfoContext.Provider
      value={{
        user,
        loadingUser,
        errorUser,
        fetchUser,
        updateUser
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
}