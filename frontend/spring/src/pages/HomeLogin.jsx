import InUpSwitch from "../components/InUpSwitch"
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import Header from "../components/header/Header";
import LoggedOutWelcome from "../components/header/LoggedOutWelcome";

import Mountain from '../assets/mountainHomeScreen2.png'

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
        
        <img className='mountain-pic' src={Mountain}></img>
        <h2 className="lets-get-you"> Lets get you logged in</h2>
        <InUpSwitch/>
      </div>
      
      <div className="login-info-card-box">
        <div className="info-card turquoise"><a href="#">Method</a></div>
        <div className="info-card blue"><a href="#">Whos it for?</a></div>
        <div className="info-card yellow"><a href="#">Ethos</a></div>
        <div className="info-card magenta"><a href="#">More about us</a></div>
      </div>
      <div className="">WHAT IT'S ALL ABOUT</div>
      <div className="method-card copy-card">
        <div>Method</div>
        <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</div>
      </div>
      <div className="who-for-card copy-card">
        <div>Who's it for</div>
        <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</div>
      </div>
      <div className="ethos-card copy-card">
        <div>Ethos</div>
        <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</div>
      </div>
      <div className="more-card copy-card">
        <div>More about us</div>
        <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</div>
      </div>
    </>
  )
};

export default HomeLogin