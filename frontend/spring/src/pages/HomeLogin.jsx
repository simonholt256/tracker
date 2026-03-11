import InUpSwitch from "../components/InUpSwitch"
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import Header from "../components/header/Header";
import LoggedOutWelcome from "../components/header/LoggedOutWelcome";

function HomeLogin () {

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    // If no token, redirect to signin
    if (!token) {
      
      
      return;
    }

    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:8000/users/me',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        navigate('/home')

      } catch {
        localStorage.removeItem('jwtToken')
        // If token invalid, redirect
      }
    };

    fetchUser();
   }, []);

  return (
    <>
    <Header/>
    <LoggedOutWelcome/>
      <div>
        <h2> Lets get you logged in</h2>
        <div>some cool picture</div>
        <InUpSwitch/>
      </div>
      
      <div className="info-card-box">
        <div className="info-card"><a href="#">Method</a></div>
        <div className="info-card"><a href="#">Whos it for?</a></div>
        <div className="info-card"><a href="#">Ethos</a></div>
        <div className="info-card"><a href="#">More about us</a></div>
      </div>
      <div className="card">then some writing that has the headers of these cards</div>
      <div className="card">Method</div>
      <div className="card">Who's it for</div>
      <div className="card">Ethos</div>
      <div className="card">More about us</div>
    </>
  )
};

export default HomeLogin