import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const StarsContext = createContext();

export function StarsProvider({ children }) {
  const [stars, setStars] = useState([]);
  const [loadingStars, setLoadingStars] = useState(true);
  const [errorStars, setErrorStars] = useState(null);

  // This flag tells ChallengesContext to refresh
  const [starsChanged, setStarsChanged] = useState(false);

  const token = localStorage.getItem("jwtToken");

  // -----------------------------
  // Fetch stars
  // -----------------------------
  const fetchStars = useCallback(async () => {
    if (!token) return;

    try {
      setLoadingStars(true);

      const res = await axios.get("http://127.0.0.1:8000/stars/", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStars(res.data);
      setErrorStars(null);
    } catch (err) {
      setErrorStars("Failed to load stars");
    } finally {
      setLoadingStars(false);
    }
  }, [token]);

  // Initial load
  useEffect(() => {
    fetchStars();
  }, [fetchStars]);

  // -----------------------------
  // Create star
  // -----------------------------
  const createStar = async (starData) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/stars/",
        starData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStars(prev => [...prev, res.data]);

      // Trigger challenge evaluation refresh
      setStarsChanged(prev => !prev);

      return { success: true };
    } catch (err) {
      return { success: false, error: "Failed to create star" };
    }
  };

  // -----------------------------
  // Update star
  // -----------------------------
  const updateStar = async (starId, updates) => {
    try {
      const res = await axios.put(
        `http://127.0.0.1:8000/stars/${starId}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStars(prev =>
        prev.map(s => (s.id === starId ? res.data : s))
      );

      // Trigger challenge evaluation refresh
      setStarsChanged(prev => !prev);

      return { success: true };
    } catch (err) {
      return { success: false, error: "Failed to update star" };
    }
  };

  // -----------------------------
  // Delete star
  // -----------------------------
  const deleteStar = async (starId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/stars/${starId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStars(prev => prev.filter(s => s.id !== starId));

      // Trigger challenge evaluation refresh
      setStarsChanged(prev => !prev);

      return { success: true };
    } catch (err) {
      return { success: false, error: "Failed to delete star" };
    }
  };

  return (
    <StarsContext.Provider
      value={{
        stars,
        loadingStars,
        errorStars,
        fetchStars,
        createStar,
        updateStar,
        deleteStar,
        starsChanged
      }}
    >
      {children}
    </StarsContext.Provider>
  );
}
