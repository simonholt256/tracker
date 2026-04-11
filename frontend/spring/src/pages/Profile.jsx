import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreatePost from '../components/CreatePost';
import DisplayPosts from '../components/DisplayPosts';

import Header from '../components/header/Header';
import Navbar from '../components/header/Navbar';
import UserWelcomeBar from '../components/header/UserWelcomeBar';

import ProfilePic from '../assets/standinprofilepic.jpg'

import LightBulb from '../assets/profile/lightbulbicon.png'
import Rocket from '../assets/profile/rocketicon.png'
import Flower from '../assets/profile/flowericon.png'
import Compass from '../assets/profile/compassicon.png'
import Microscope from '../assets/profile/microscopeicon.png'
import Fist from '../assets/profile/fisticon.png'

import '../cssStyles/Profile.css'



function Profile() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [icon, setIcon] = useState('')
  const [mantra, setMantra] = useState('')
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedMantra, setSelectedMantra] = useState('');

  const icons = [
    LightBulb,
    Rocket,
    Flower,
    Compass,
    Microscope,
    Fist
  ];

  const mantras = [
    "Don’t let perfect be the enemy of good.",
    "A mountain is climbed one step at a time.",
    "Rome wasn’t built in a day.",
    "Do it for her.",
    "I am greater than my highs and lows.",
    "I do it anywaaayyy."
  ];

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

        setUserId(response.data.id);
        setUserName(response.data.user_name);
        setIcon(response.data.icon_image ?? 0)
        setMantra(response.data.mantra ?? "Don’t let perfect be the enemy of good.");

      } catch (error) {
        console.log(error.response.data);
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
          <div className='profile-pic-box'>
            <img className='profile-pic' src={icons[icon]}></img>
          </div>
          
          <div className='name-mantra'>
            <div className='mantra-title'>Username: </div>
            <h2 className='segment'>{userName}</h2>
            <div className='mantra-title'>Mantra: </div>
            <div className='segment'>
              
              <div className='profile-mantra'>{mantra}</div>
            </div>
            {/* <div className='segment'> something else here, for balance</div> */}
            
          </div>
          <button
            className='edit-button'
            onClick={() => {
              setEditName(userName);
              setSelectedIcon(icon);
              setSelectedMantra(mantra);
              setIsEditing(true);
            }}
          >
            Edit profile
          </button>
        </div>
        {/* <div>could have stats, like total stars, longest streak, time improving etc etc etc</div> */} 
        {/* <CreatePost onPostCreated={(newPost) => setPosts(prev => [newPost, ...prev])}/>
        <DisplayPosts state="user"/>
        <DisplayPosts state="all"/> */}
        {isEditing && (
          <div className="edit-profile-box">
            <h3>Username</h3>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Username"
            />

            <h3>Select Icon</h3>
            <div className="icon-grid">
              {icons.map((icon, i) => (
                <img
                  key={i}
                  src={icon}
                  onClick={() => setSelectedIcon(i)}
                  style={{
                    padding: "4px",
                    margin: "4px",
                    border: selectedIcon === i ? "2px solid yellow" : "none",
                    cursor: "pointer",
                    width: 50
                  }}
                />
              ))}
            </div>

            <h3>Select Mantra</h3>
            <div className="mantra-list">
              {mantras.map((m, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedMantra(m)}
                  style={{
                    padding: 8,
                    border: selectedMantra === m ? "2px solid green" : "1px solid gray",
                    cursor: "pointer"
                  }}
                >
                  {m}
                </div>
              ))}
            </div>

            <button
              onClick={async () => {
                const token = localStorage.getItem('jwtToken');

                await axios.put(
                  `http://127.0.0.1:8000/users/${userId}`,
                  {
                    user_name: editName,
                    mantra: selectedMantra,
                    icon_image: String(selectedIcon)
                  },
                  {
                    headers: { Authorization: `Bearer ${token}` }
                  }
                );

                setUserName(editName);
                setIcon(selectedIcon);
                setMantra(selectedMantra);
                setIsEditing(false);
              }}
            >
              Save
            </button>
            <button 
            className='challenge-close-button'
            onClick={() => setIsEditing(false)}
            >x</button>
          </div>
        )}
        
      </div>
    </>
    
  );
}

export default Profile;