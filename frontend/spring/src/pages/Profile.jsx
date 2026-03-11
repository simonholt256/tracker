import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreatePost from '../components/CreatePost';
import DisplayPosts from '../components/DisplayPosts';

import Header from '../components/header/Header';
import Navbar from '../components/header/Navbar';
import UserWelcomeBar from '../components/header/UserWelcomeBar';

import ProfilePic from '../assets/standinprofilepic.jpg'

import '../cssStyles/Profile.css'



function Profile() {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  

  const [posts, setPosts] = useState([]);

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

        setUserName(response.data.user_name);

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
      <div className='profile-page'>
        
        <h1>Profile</h1>
        <div className='profile-info-box'>
          
          <img className='profile-pic' src={ProfilePic}></img>
          <div className='name-mantra'>
            <h2 className='segment'>{userName}</h2>
            <div className='segment'>
              <div>Mantra: </div>
              <div>A mountain is climbed one step at a time.</div>
            </div>
            <div className='segment'> something else here, for balance</div>
            
          </div>
          <button className='edit-button'>Edit profile</button>
        </div>
        <div>could have stats, like total stars, longest streak, time improving etc etc etc</div>
        
          
          
          
        
        {/* <CreatePost onPostCreated={(newPost) => setPosts(prev => [newPost, ...prev])}/>
        <DisplayPosts state="user"/>
        <DisplayPosts state="all"/> */}
        
      </div>
    </>
    
  );
}

export default Profile;