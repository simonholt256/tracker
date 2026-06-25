import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Header from '../components/header/Header';
import Navbar from '../components/header/Navbar';
import UserWelcomeBar from '../components/header/UserWelcomeBar';

import Mountains from '../assets/mountains.png'

import Pencil from '../assets/pencil.png'

import Addintention from '../assets/addintention.png'

import '../cssStyles/Intentions.css'




function IntentionsPage () {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('')

  const [intentionText, setIntentionText] = useState(''); // for input form
  const [toQuit, setToQuit] = useState(false);  // optional toggle
  const [noteText, setNoteText] = useState("");

  const [intentions, setIntentions] = useState([]);

  const [selectedIntention, setSelectedIntention] = useState([])

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

  const createIntention = async (text, quit, note = false) => {
    if (!text.trim()) return; 
    

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/intentions/",
        {
          intention: text,
          to_quit: quit,
          note: note
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Intention created:", response.data);
      setIntentions(prev => [response.data, ...intentions]); // add new intention to the list
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
      <div className='intention-page-split'>
        {/* <div className='intentions-left-column' ></div> */}
        <div className='set-intentions'>
          <div className='set-intentions-tab'></div>
          <h3>Intentions:</h3>
          {intentions.length === 0 && <p>No intentions yet, add something above</p>}
          <ul className='intentions-ul'>
            {intentions.map((item) => (
              <li onClick={() => setSelectedIntention(item)} className={`set-intention ${item.to_quit ? "quit-intention" : ""} ${selectedIntention?.id === item.id ? 'selected-intent' : ''}`} key={item.id}>
                {item.intention} {item.to_quit ? "(Quit)" : ""}
              </li>
            ))}
          </ul>
        </div>
        <div className='intentions-right-column'>
          <div className='intentions-right-column__button-and-pic'>
            <div className='intentions-right-column__button-box'>
              <img onClick={() => setAddIntentionsVisable(prev => !prev)} className='add-intention-img' src={Addintention}></img>
            </div>
            
            
          </div>
          <div className='intentions-right-column__box'>
            <div className='intentions-right-column__display'>
              <img className='pencil-img' src={Pencil}></img>
              <div className='intention-file'>intention file</div>
              {selectedIntention.intention ? (
                <>
                  <div>Intention:</div>
                  <div className='intention-info-display'>{selectedIntention.intention}</div>
                  <div>Note:</div>
                  <div className='intention-info-display'>{selectedIntention.note ? selectedIntention.note : "No note avaliable" }</div>
                  <div>Start date:</div>
                  <div className='intention-info-display'>{selectedIntention.created_at?.split('T')[0]}</div>
                  {/* <div>Days active:</div> */}
                  <div>Active challenges: 2</div>
                  <div>Completed challenges: 0</div>
                  <div>Total stars: 50</div>
                  <div className='edit-intentions-buttons'>
                    <button className='edit-intentions-button'>Edit</button>
                    <button className='edit-intentions-button'>Retire</button>
                    <button className='edit-intentions-button'>Delete</button>
                  </div>
                </>
              ) : (
                <div>Select an intention</div>
              )}
              
            </div>
            
          </div>
          <div className='intention-help-box'>
            <div className='intention-help'>
              It's best to set simple and achievable goals. If an intention can't be summed up in a simple phrase consider splitting the objective into smaller more manageable chunks.
            </div>
          </div>
        </div> 
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
            <div>Add a note
              
              <input
                type="text"
                placeholder="Add a note"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
              
            </div>
            <button className='add-button' onClick={() => {createIntention(intentionText, toQuit, noteText); setAddIntentionsVisable(prev => !prev);}} style={{ padding: '8px 12px', width: '200px' }}>
              Add Intention
            </button>
            
            <button className='challenge-close-button' onClick={() => setAddIntentionsVisable(prev => !prev)}>{addIntentionsVisable ? "x" : ""}</button>
          </div>
        )} 
      </div>
      
      
    </>
  )
}

export default IntentionsPage