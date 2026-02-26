import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';

function UserWelcomeBar() {

  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    // If no token, redirect to signin
    if (!token) {
      setUserName('');
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
        console.error('Failed to fetch user', error);
        setUserName('');
        
      }
    };

    fetchUser();

  }, []);

    const handleLogout = () => {
    localStorage.removeItem('jwtToken'); // delete JWT
    setUserName('');
    navigate('/signin');
  };

  return (
    <div className="welcome-bar">
      <p>{userName
        ? `Welcome, ${userName}`
        : 'Welcome, you are not signed in'}</p>
      <div className="sign-in-up-bar">
        {userName ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <NavLink to="/signin" className="welcome-signin">
              Sign In
            </NavLink>
            <NavLink to="/signup" className="welcome-signup">
              Sign Up
            </NavLink>
          </>
        )}
        
      </div>
      
    </div>
  );
}

export default UserWelcomeBar