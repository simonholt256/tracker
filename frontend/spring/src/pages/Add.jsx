import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Header from '../components/header/Header';
import Navbar from '../components/header/Navbar';
import UserWelcomeBar from '../components/header/UserWelcomeBar';

import '../cssStyles/Add.css'




function Add () {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('')

  const [intentionText, setIntentionText] = useState(''); // for input form
  const [toQuit, setToQuit] = useState(false);  // optional toggle
  const [intentions, setIntentions] = useState([]);

  const [intentionsVisable, setIntentionsVisable] = useState(false);

  const [intentionChoice, setIntentionChoice] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0,10)); // yyyy-mm-dd
  const [duration, setDuration] = useState(7)
  const [targetCount, setTargetCount] = useState(1)
  const [periodDays, setPeriodDays] = useState(1)
  const [frequency, setFrequency] = useState('1-1')

  const [daySelection, setDaySelection] = useState('all'); // "all" or "weekdays"
  const [strict, setStrict] = useState(true); // boolean
  const [trophyId, setTrophyId] = useState(1); // optional

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

  const createIntention = async (text, quit = false) => {
    if (!text.trim()) return; 
    

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/intentions/",
        {
          intention: text,
          to_quit: quit
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Intention created:", response.data);
      setIntentions([response.data, ...intentions]); // add new intention to the list
      setIntentionText(''); // clear input
      setToQuit(false);     // reset checkbox
      // Optionally, you can update state to show the new intention in the UI
    } catch (error) {
      console.error("Error creating intention:", error.response?.data || error.message);
    }
  };

  const calculateEndDate = (start, days) => {
    const startObj = new Date(start);
    startObj.setDate(startObj.getDate() + days - 1); // subtract 1 because start counts as day 1
    return startObj.toISOString(); // full ISO string with time
  };

  const createChallenge = async () => {
    if (!intentionChoice) {
      alert("Please select an intention first");
      return;
    }

    const endDate = calculateEndDate(startDate, duration);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/challenges/",
        {
          intention_id: intentionChoice,
          start_date: startDate,
          duration_days: duration,
          end_date: endDate,
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
      <div className='add-box'>
        <h2 className='add-title'>Add an Intention</h2>
        <div>
          <button onClick={() => setToQuit(false)}>To introduce</button>
          <button onClick={() => setToQuit(true)}>To stop/reduce</button>
        </div>
        <div style={{ margin: '10px', background: toQuit ? '#e08d8b' : '#d5f2cb'}}>
          <input
            type="text"
            placeholder="Enter your intention"
            value={intentionText}
            onChange={(e) => setIntentionText(e.target.value)}
            style={{ padding: '8px', width: '300px', margin: '10px' }}
          />
        </div>
        <button style={{ margin: '12px'}}>would be nice to have option to add note here</button>
        <button className='add-button' onClick={() => createIntention(intentionText, toQuit)} style={{ padding: '8px 12px', width: '200px' }}>
          Add Intention
        </button>
      </div>
      <div>display the most resent added intention here</div>
      <div>
        <button onClick={() => setIntentionsVisable(prev => !prev)}>{intentionsVisable ? "hide current intentions" : "view current intentions"}</button>
        {intentionsVisable && (
          <div>
            <h3>Intentions:</h3>
            {intentions.length === 0 && <p>No intentions yet, add something above</p>}
            <ul>
              {intentions.map((item) => (
                <li className={`set-intention ${item.to_quit ? "quit-intention" : ""}`} key={item.id}>
                  {item.intention} {item.to_quit ? "(Quit)" : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
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
          <p>You selected: {intentionChoice}</p>
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
        <div style={{ padding: "12px", margin: "20px"}}>
          <div>start date: {startDate}</div>
          <div>duration: {duration}</div>
          <div>target count: {targetCount}</div>
          <div>period: {periodDays}</div>
          <div>frequency: {frequency}</div>
          <div>strict: {strict ? "true" : "false"}</div>
          <div>trophy type: {trophyId}</div>
        </div>
        
        <button className='add-button' onClick={() => createChallenge()} style={{ padding: '8px 12px', width: '200px' }}>
          Add Challenge
        </button>
      </div>
      
      
    </>
  )
}

export default Add 