import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Header from '../components/header/Header';
import Navbar from '../components/header/Navbar';
import UserWelcomeBar from '../components/header/UserWelcomeBar';

import AddGoal from "../components/add/AddGoal"
import AddChallenge from "../components/add/AddChallenge"




function Add () {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('')
  
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    // If no token, redirect to signin
    if (!token) {
      navigate('/');
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

        setUserName(response.data.user_name)

      } catch (error) {
        console.error(error);
        navigate('/'); // If token invalid, redirect
      }
    };

    fetchUser();

  }, [navigate]);

  return (
    <>
      <Header/>
      <Navbar/>
      <UserWelcomeBar currentUserName={userName}/>
      <AddGoal/>
      <AddChallenge/>
    </>
  )
}

export default Add 