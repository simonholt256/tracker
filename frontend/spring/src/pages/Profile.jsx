import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreatePost from '../components/CreatePost';
import DisplayPosts from '../components/DisplayPosts';
import Navbar from '../components/header/Navbar';

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

    const handleLogout = () => {
    localStorage.removeItem('jwtToken'); // delete JWT
    navigate('/signin'); // redirect to signin
  };

  return (
    <div className='profile-split'>
      <div>
        <h1>Profile</h1>
        <p>Welcome, {userName}</p>
        <button onClick={handleLogout}>Logout</button>
        <CreatePost onPostCreated={(newPost) => setPosts(prev => [newPost, ...prev])}/>
      </div>
      
      <DisplayPosts state="user"/>
      <DisplayPosts state="all"/>
      
    </div>
  );
}

export default Profile;