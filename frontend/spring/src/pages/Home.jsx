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
  const [icon, setIcon] = useState('')
  const [mantra, setMantra] = useState('')
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
        setIcon(response.data.icon_image ?? 0)
        setMantra(response.data.mantra ?? "Don’t let perfect be the enemy of good.");
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
        <div className='page-box'>
          <div className="home-box">
            <div className="home-box-top">
              <ProfileHome
                userName={userName}
                userImage={icon}
                userMantra={mantra}  
              />
              <AchievementDisplay/>
            </div>
            <div className="home-box-bottom">
              <MyIntentionsHome/>
              <ExtraInfo/>
              <div>
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
              </div>
            </div>
          </div>
        </div> 
      </>
    </>
  )
}

export default Home