import React, { useEffect, useState} from 'react';
import axios from 'axios';

import Header from '../components/header/Header';
import Navbar from '../components/header/Navbar';
import UserWelcomeBar from '../components/header/UserWelcomeBar';

import '../cssStyles/Wins.css'

import Trophy1 from '../assets/trophies/trophy1.png'
import Trophy2 from '../assets/trophies/trophy2.png'
import Trophy3 from '../assets/trophies/trophy3.png'
import Trophy4 from '../assets/trophies/trophy4.png'
import Trophy5 from '../assets/trophies/trophy5.png'
import Trophy6 from '../assets/trophies/trophy6.png'

import Tick from '../assets/tick.png'

import { useNavigate } from 'react-router-dom';


function Wins () {

  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const [intentions, setIntentions] = useState([])
  const [completedChallenges, setCompletedChallenges] = useState([])
  const [stars, setStars] = useState([]);
  const [displaywins, setDisplayWins] = useState('cabinet')

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

    const fetchIntentions = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/intentions/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIntentions(response.data);

      } catch (error) {
        console.error(error);
      }
    };

    const fetchCompletedChallenges = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/challenges/",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const completed = response.data.filter(
          challenge => challenge.status === "completed"
        );

        setCompletedChallenges(completed);

      } catch (error) {
        console.error(error);
      }
    };

     const fetchStars = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/stars/",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setStars(response.data);

      } catch (error) {
        console.error(error);
      }
    };

    

    fetchIntentions();
    fetchCompletedChallenges();
    fetchStars();
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
          <button>trophy cabinet</button>
          <button>star sheets</button>
        </div>
        
        <div className='awards-box'>
          <div className='cabinet'>
            {completedChallenges.map((item) => 
              item.status === "completed" ? (
              <img className='cabinet-trophy' src={trophyMap[item.trophy_id]} key={item.id}></img>
            ): null
          )}
          </div>
          <div className='trophy-des'>a box that says what the trophy is when you click on it</div>
        </div>
        
        <div>
          <h3>Completed challenges:</h3>
          
          {completedChallenges.length === 0 && <p>No completed challenges yet</p>}
          <ul>
            {completedChallenges.map((item) => (
              <li className='li-item' key={item.id}>
                <div className={`completed-intention`}>
                  {intentions.find(i => i.id === item.intention_id)?.intention}
                  {item.target_count} times in {item.period_days} days for {item.duration_days} days. - {item.status}
                </div>
                <div>
                  <img className='tick' src={Tick}></img>
                </div>
              </li>
            
            ))}
          </ul>
        </div>
        <div>intentions and there stars, and later star sheets</div>
        <ul>
          {intentions.map((intention) => {
            const intentionStarCount = stars.filter(
              star => star.habit_id == intention.id
            ).length;

            return (
              <li className='li-intention-stars' key={intention.id}>
                <div>
                  {intention.intention} - {intentionStarCount} ⭐'s:
                  
                </div>
                <div>
                  {Array.from({ length: intentionStarCount }).map((_, i) => (
                    <span key={i}>⭐</span>
                  ))} 
                </div>
                {/* <div>maybe when you click you can see all the stars</div> */}
                
              </li>
            );
          })}
        </ul>
      </div>
    </>
    
  );
}

export default Wins