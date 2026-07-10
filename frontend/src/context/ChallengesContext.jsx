import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


export const ChallengesContext = createContext();

export function ChallengesProvider({ children, starsChanged }) {
  const [challenges, setChallenges] = useState([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [errorChallenges, setErrorChallenges] = useState(null);

  const token = localStorage.getItem("jwtToken");

  const { user } = useContext(AuthContext);


  // -----------------------------
  // Fetch all challenges
  // -----------------------------
  const fetchChallenges = useCallback(async () => {
    if (!token) return;

    try {
      setLoadingChallenges(true);

      const res = await axios.get("http://127.0.0.1:8000/challenges/", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setChallenges(res.data);
      setErrorChallenges(null);
    } catch (err) {
      setErrorChallenges("Failed to load challenges");
    } finally {
      setLoadingChallenges(false);
    }
  }, [token]);

  /* refresh on user sign in */

  useEffect(() => {
    if (user) {
      fetchChallenges();
    }
  }, [user, fetchChallenges]);


  // -----------------------------
  // Refresh when stars change
  // -----------------------------
  useEffect(() => {
    if (starsChanged) {
      fetchChallenges();
    }
  }, [starsChanged, fetchChallenges]);

  // -----------------------------
  // Initial load
  // -----------------------------
  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  // -----------------------------
  // Create challenge
  // -----------------------------
  const createChallenge = async (challengeData) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/challenges/",
        challengeData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChallenges(prev => [res.data, ...prev]);
      return { success: true };
    } catch (err) {
      return { success: false, error: "Failed to create challenge" };
    }
  };

  // -----------------------------
  // Update challenge
  // -----------------------------
  const updateChallenge = async (challengeId, updates) => {
    try {
      const res = await axios.put(
        `http://127.0.0.1:8000/challenges/${challengeId}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChallenges(prev =>
        prev.map(c => (c.id === challengeId ? res.data : c))
      );

      return { success: true };
    } catch (err) {
      return { success: false, error: "Failed to update challenge" };
    }
  };

  // -----------------------------
  // Delete challenge
  // -----------------------------
  const deleteChallenge = async (challengeId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/challenges/${challengeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChallenges(prev => prev.filter(c => c.id !== challengeId));
      return { success: true };
    } catch (err) {
      return { success: false, error: "Failed to delete challenge" };
    }
  };

  // -----------------------------
  // Filter challenges by intention
  // -----------------------------
  const getChallengesForIntention = (intentionId) => {
    return challenges.filter(c => c.intention_id === intentionId);
  };

  return (
    <ChallengesContext.Provider
      value={{
        challenges,
        loadingChallenges,
        errorChallenges,
        fetchChallenges,
        createChallenge,
        updateChallenge,
        deleteChallenge,
        getChallengesForIntention
      }}
    >
      {children}
    </ChallengesContext.Provider>
  );
}
