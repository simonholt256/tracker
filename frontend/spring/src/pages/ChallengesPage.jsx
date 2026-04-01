import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Header from '../components/header/Header';
import Navbar from '../components/header/Navbar';
import UserWelcomeBar from '../components/header/UserWelcomeBar';

import Trophy1 from '../assets/trophies/trophy1.png'
import Trophy2 from '../assets/trophies/trophy2.png'
import Trophy3 from '../assets/trophies/trophy3.png'
import Trophy4 from '../assets/trophies/trophy4.png'
import Trophy5 from '../assets/trophies/trophy5.png'
import Trophy6 from '../assets/trophies/trophy6.png'

import Column from '../assets/column.png'
import Rosette from '../assets/rosette.png'

import '../cssStyles/Intentions.css'

function ChallengesPage () {

  const navigate = useNavigate();
  const [userName, setUserName] = useState('')

  const [intentions, setIntentions] = useState([]);

  const [addChallengeVisable, setAddChallengeVisable] = useState(false);

  const [intentionChoice, setIntentionChoice] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0,10)); // yyyy-mm-dd
  const [duration, setDuration] = useState(7)
  const [targetCount, setTargetCount] = useState(1)
  const [periodDays, setPeriodDays] = useState(1)
  const [frequency, setFrequency] = useState('1-1')

  const [challenges, setChallenges] = useState([])

  const [daySelection, setDaySelection] = useState('all'); // "all" or "weekdays"
  const [strict, setStrict] = useState(true); // boolean
  const [trophyId, setTrophyId] = useState(1); // optional

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
            }}
        );
        setUserName(response.data.user_name)

      } catch (error) {
        console.error(error);
        navigate('/'); // If token invalid, redirect
      }
    };

    fetchUser();

  }, [navigate, token]);

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
    fetchIntentions();
  }, [token]);

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



  const createChallenge = async () => {
    if (!intentionChoice) {
      alert("Please select an intention first");
      return;
    }

   

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/challenges/",
        {
          intention_id: intentionChoice,
          start_date: startDate,
          duration_days: duration,
          target_count: targetCount,
          period_days: periodDays,
          strict: strict,
          trophy_id: trophyId,
          status: "active" // default status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Challenge created:", response.data);
      alert("Challenge created successfully!");
      // Optionally clear form or reset state here
    } catch (error) {
      console.error("Error creating challenge:", error.response?.data || error.message);
      alert("Failed to create challenge");
    }
  };


  return (
    <>
      <Header/>
      <Navbar/>
      <UserWelcomeBar currentUserName={userName}/>
      <div className='challenges-page'>
        
        <div className='first-column'>
          <img className='rosette' src={Rosette}></img>
        </div>
        <div>
          <h3>Challenges:</h3>
          {challenges.length === 0 && <p>No challenges yet, add something above</p>}
          <ul className='challenges-display-box'>
            {challenges.map((item) => (
              <li className={`set-intention`} key={item.id}>
                <div className='challenge-box'>
                  <div>
                    <div>{intentions.find(i => i.id === item.intention_id)?.intention}</div>
                    <div>{item.target_count} times in {item.period_days} days for {item.duration_days} days.</div>
                    <div>Starting on {item.start_date}</div>
                    <div>how many days left?</div>
                    {/* could have only intention the amount and status, and then if opened the box gets bigger and shows starting date, time left etc */}
                  </div>
                  <div>{item.status}</div>
                  <div>
                    <img className='trophy-small' src={trophyMap[item.trophy_id]}/>
                  </div>
                </div>
                
              </li>
            ))}
          </ul>
        </div>
        <div className='third-column'>
          <button className='add-challenge-button' onClick={() => setAddChallengeVisable(prev => !prev)}>Add a challenge</button>
          <div className='below-add-button'>
            <img className='column' src={Column}></img>
          </div>
          {addChallengeVisable && (
            <div className='add-box'>
              <h2 className='add-title'>Add a Challenge</h2>
              <div>
                <select value={intentionChoice} onChange={(e) => setIntentionChoice(parseInt(e.target.value))}>
                  <option placevalue="">Select your intention</option>
                  {intentions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.intention} {item.to_quit ? "(Quit)" : ""}
                    </option>
                  ))}
                </select>
                {/* <p>You selected: {intentionChoice}</p> */}
              </div>
              <div>
                <span>starting from: </span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <select 
                  value={frequency}
                  onChange={(e) => {
                    const [target, period] = e.target.value.split('-').map(Number);
                    setTargetCount(target);
                    setPeriodDays(period);
                    setFrequency(e.target.value)
                  }}
      >
                  <option value="1-1">Everyday</option>
                  <option value="5-7">5 days a week</option>
                  <option value="3-7">3 times a week</option>
                  <option value="1-7">Once a week</option>
                  {/* <option value="custom">Custom</option> */}
                </select>
                
                <span>for</span>
                <select value={duration} onChange={(e) => setDuration(parseInt(e.target.value))}>
                  <option value="7">a week</option>
                  <option value="14"> 2 weeks</option>
                  <option value="28">month (4 weeks)</option>
                  <option value="30">month (exact) </option>
                  <option>custom</option>
                </select>
                {/* custom, must be lower than selected duration */}
              </div>
              <div>
                {frequency === "1-1" ? (
                  <div>
                    <input
                      type="radio"
                      name="daySelection"
                      value="all"
                      checked={daySelection === 'all'}
                      onChange={() => {
                        setDaySelection('all')
                        setTargetCount(1);
                        setPeriodDays(1)}}
                    />
                    <label>All days</label>

                    <input
                      type="radio"
                      name="daySelection"
                      value="weekdays"
                      checked={daySelection === 'weekdays'}
                      onChange={() => {
                        setDaySelection('weekdays');
                        setTargetCount(5);
                        setPeriodDays(7)}}
                    />
                    <label>Weekdays only</label>
                  </div>
                  
                ) : (
                  <div></div>
                )}
                
              </div>
              <div>how strict???</div>
              <div>
                <input
                  type="radio"
                  name="strictness"
                  checked={strict === true}
                  onChange={() => setStrict(true)}
                />
                <label>Strict</label>

                <input
                  type="radio"
                  name="strictness"
                  checked={strict === false}
                  onChange={() => setStrict(false)}
                />
                <label>Lenient</label>
              </div>
              {strict ? (
                <div>Only full stars count towards your goal (but passes always count as a star)</div>
              ) : (
                <div>Half stars count and we might help you out with some rounding</div>
              )}
              <div>CHOOSE YOUR TROPHY</div>
              <select value={trophyId} onChange={(e) => setTrophyId(parseInt(e.target.value))}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
              <div className='select-trophy-box'></div>
              {/* <div style={{ padding: "12px", margin: "20px"}}>
                <span>start date: {startDate} - </span>
                <span>duration: {duration}</span>
                <br></br>
                <span>target count: {targetCount} - </span>
                <span>period: {periodDays} - </span>
                <span>frequency: {frequency}</span>
                <br></br>
                <span>strict: {strict ? "true" : "false"}</span>
                <span>trophy type: {trophyId}</span>
              </div> */}
              
              <button className='add-button' onClick={() => {
                createChallenge();
                setAddChallengeVisable(prev => !prev);
              }} style={{ padding: '8px 12px', width: '200px' }}>
                Add Challenge
              </button>
              <button onClick={() => setAddChallengeVisable(prev => !prev)}>{addChallengeVisable ? "close box" : ""}</button>
            </div>
          )}
        </div>
      </div>
        
        
    </>
  )
}

export default ChallengesPage