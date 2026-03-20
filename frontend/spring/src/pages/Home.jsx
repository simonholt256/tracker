import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Header from "../components/header/Header";

import UserWelcomeBar from '../components/header/UserWelcomeBar';
import Navbar from '../components/header/Navbar';

import ProfileHome from "../components/home/ProfileHome"
import AchievementDisplay from "../components/home/AchievementDisplay"
import MyIntentionsHome from '../components/home/MyIntentionsHome';
import ExtraInfo from "../components/home/ExtraInfo"



import { useNavigate } from 'react-router-dom';

import '../cssStyles/Home.css'



function Home() {

  const [isAuth, setIsAuth] = useState(null)
  const [userName, setUserName] = useState('')
  const navigate = useNavigate();

  
  
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    // If no token, redirect to signin
    if (!token) {
      navigate('/');
      setIsAuth(false);
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

        setIsAuth(true)
        setUserName(response.data.user_name)
        console.log(userName)

      } catch (error) {
        console.error(error);
        setIsAuth(false);
        localStorage.removeItem('jwtToken')
        // If token invalid, redirect
      }
    };

    fetchUser();

  }, []);

  

  return (
    <>
      <Header/>
      <Navbar/>
      <UserWelcomeBar currentUserName={userName}/>
      <>  
          <div className="home-box">
            <div className="home-box-top">
              <ProfileHome
                userName={userName}
                userImage={"picture"}
                userMantra={"Each day a drop, will fill a cup, and then the ocean. I do it anyway."}  
              />
              <AchievementDisplay/>
            </div>
            <div className="home-box-bottom">
              <MyIntentionsHome/>
              <ExtraInfo/>
            </div>
          </div>
        
      </>
    </>
  )
}

export default Home