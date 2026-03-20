import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Header from '../components/header/Header';
import Navbar from '../components/header/Navbar';
import UserWelcomeBar from '../components/header/UserWelcomeBar';

import '../cssStyles/Intentions.css'




function IntentionsPage () {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('')

  const [intentionText, setIntentionText] = useState(''); // for input form
  const [toQuit, setToQuit] = useState(false);  // optional toggle
  const [intentions, setIntentions] = useState([]);

  const [addIntentionsVisable, setAddIntentionsVisable] = useState(false);

  

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

  
  return (
    <>
      <Header/>
      <Navbar/>
      <UserWelcomeBar currentUserName={userName}/>
      <button className='add-button' onClick={() => setAddIntentionsVisable(prev => !prev)}>{addIntentionsVisable ? "hide Add an intention" : "Add an intention"}</button>
      <div className='set'>
        
        {addIntentionsVisable && (
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
        )}
        
      </div>
      <div className='set-intentions'>
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
      
    </>
  )
}

export default IntentionsPage