import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const IntentionsContext = createContext();

export function IntentionsProvider({ children }) {
  const { user: authUser } = useContext(AuthContext);

  const [intentions, setIntentions] = useState([]);
  const [loadingIntentions, setLoadingIntentions] = useState(true);
  const [errorIntentions, setErrorIntentions] = useState(null);

  const token = localStorage.getItem("jwtToken");

  // Fetch intentions
  const fetchIntentions = async () => {
    if (!authUser || !token) {
      setIntentions([]);
      return;
    }

    try {
      const res = await axios.get("http://127.0.0.1:8000/intentions", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIntentions(res.data);
      setErrorIntentions(null);
    } catch (err) {
      setErrorIntentions("Failed to load intentions.");
    } finally {
      setLoadingIntentions(false);
    }
  };

  // Create intention
  const createIntention = async (newIntention) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/intentions",
        newIntention,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIntentions(prev => [...prev, res.data]);
      return { success: true };
    } catch {
      return { success: false, error: "Failed to create intention." };
    }
  };

  // Update intention
  const updateIntention = async (id, updates) => {
    try {
      const res = await axios.put(
        `http://127.0.0.1:8000/intentions/${id}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIntentions(prev =>
        prev.map(i => (i.id === id ? res.data : i))
      );

      return { success: true };
    } catch {
      return { success: false, error: "Failed to update intention." };
    }
  };

  // Delete intention
  const deleteIntention = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/intentions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIntentions(prev => prev.filter(i => i.id !== id));
      return { success: true };
    } catch {
      return { success: false, error: "Failed to delete intention." };
    }
  };

  // Load intentions when auth changes
  useEffect(() => {
    if (authUser) {
      fetchIntentions();
    } else {
      setIntentions([]);
    }
  }, [authUser]);

  return (
    <IntentionsContext.Provider
      value={{
        intentions,
        loadingIntentions,
        errorIntentions,
        fetchIntentions,
        createIntention,
        updateIntention,
        deleteIntention
      }}
    >
      {children}
    </IntentionsContext.Provider>
  );
}