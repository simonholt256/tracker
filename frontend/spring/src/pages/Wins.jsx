import React, { useEffect, useState} from 'react';
import axios from 'axios';

import Header from '../components/header/Header';
import Navbar from '../components/header/Navbar';
import UserWelcomeBar from '../components/header/UserWelcomeBar';

import Trophy1 from '../assets/trophies/trophy1.png'
import Trophy2 from '../assets/trophies/trophy2.png'
import Trophy3 from '../assets/trophies/trophy3.png'
import Trophy4 from '../assets/trophies/trophy4.png'
import Trophy5 from '../assets/trophies/trophy5.png'
import Trophy6 from '../assets/trophies/trophy6.png'

import { useNavigate } from 'react-router-dom';


function Wins () {

  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([])

  const trophyMap = {
      1: Trophy1,
      2: Trophy2,
      3: Trophy3,
      4: Trophy4,
      5: Trophy5,
      6: Trophy6
    };

  const token = localStorage.getItem('jwtToken');

  useEffect(() => {

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

  useEffect(() => {
    if (!token) return;

    const fetchChallenges = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/challenges/",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setChallenges(response.data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchChallenges();
  }, [token]);

  return (
    <>
      <Header/>
      <Navbar/>
      <UserWelcomeBar currentUserName={userName}/>
      <div className='profile-page'>
        
        <h1>Wins</h1>
        <div>we have star sheets and trophy cabinet</div>
        <div>
          <h3>Challenges:</h3>
          {challenges.length === 0 && <p>No intentions yet, add something above</p>}
          <ul>
            {challenges.map((item) => (
              <li className={`set-intention`} key={item.id}>
                intention No:{item.intention_id}, {item.target_count} times in {item.period_days} days for {item.duration_days} days.
                Starting on {item.start_date}, ending on {item.end_date} {item.trophy_id}
                <span>
                  <img className='trophy-small' src={trophyMap[item.trophy_id]}/>
                </span>
                <span> - {item.status}</span>
              </li>
            ))}
          </ul>
        </div>
        
      </div>
    </>
    
  );
}

export default Wins