import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Header from '../components/header/Header';
import Navbar from '../components/header/Navbar';
import UserWelcomeBar from '../components/header/UserWelcomeBar';

import WinsCalendar from '../components/wins/WinsCalendar';

import Calendar from 'react-calendar';

// import 'react-calendar/dist/Calendar.css';
import '../cssStyles/Wins.css'

function Wins () {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('')
  const [intentions, setIntentions] = useState([]);
  const [selectedIntention, setSelectedIntention] = useState(null);

  const [stars, setStars] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);


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

        setUserName(response.data.user_name)

      } catch (error) {
        console.error(error);
        navigate('/'); // If token invalid, redirect
      }
    };

    const fetchIntentions = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/intentions/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIntentions(response.data);
        if (response.data.length > 0) {
        setSelectedIntention(response.data[0]);
      }

      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
    fetchIntentions();

  }, [navigate]);

  useEffect(() => {

    if (!token) return;

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

    fetchStars();
  }, []);

  const createStar = async (date) => {
  
    const formattedDate = date.toISOString().split("T")[0];

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/stars/",
        {
          habit_id: selectedIntention.id,
          date_checked: formattedDate,
          check_level: 4
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setStars(prev => [response.data, ...prev]);

    } catch (error) {
      console.error(error);
    }
  };

  const getStarForDate = (date) => {
    if (!selectedIntention) return null;

    return stars.find(
      (star) =>
        star.habit_id === selectedIntention.id &&
        new Date(star.date_checked).toDateString() === date.toDateString()
    );
  };

  const handleDeleteStar = async (starId) => {
    
    if (!token) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/stars/${starId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove the deleted star from state
      setStars(stars.filter((s) => s.id !== starId));

    } catch (error) {
      console.error("Error deleting star:", error.response?.data || error.message);
    }
  };

  const hasStar = (date) => {
    if (!selectedIntention) return false;

    return stars.some((star) => {
      return (
        star.habit_id === selectedIntention.id &&
        new Date(star.date_checked).toDateString() === date.toDateString()
      );
    });
  };

  useEffect(() => {
    if (!selectedIntention) return;

    const fetchChallenges = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/challenges/intention/${selectedIntention.id}`,
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
  }, [selectedIntention, token]);

  const isChallengeDay = (date) => {
    if (!selectedChallenge) return false;

    const start = new Date(selectedChallenge.start_date);
    const end = new Date(selectedChallenge.end_date);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const current = new Date(date);
    current.setHours(0, 0, 0, 0);

    return current >= start && current <= end;
  };

  return (
    <>
      <Header/>
      <Navbar/>
      <UserWelcomeBar currentUserName={userName}/>
      <div className='wins-page-box'>
        <div>
          {selectedIntention && (
            <div className='choosen-intent-title'>{selectedIntention.intention}</div>
          )}
          <div>
            <button>week</button>
            <button>month</button>
            <button>2 months</button>
            <button>4 months</button>
            <button>6 months</button>
            <button>year</button>
          </div>
          
          <div className='calendar-box'>
            <Calendar
              value={selectedDate}
              selectedChallenge={selectedChallenge}
              onChange={setSelectedDate}
              tileClassName={({ date, view }) => {
                if (view === "month" && isChallengeDay(date)) {
                  return "challenge-day";
                }
              }}
              tileContent={({ date, view }) => {
                if (view !== "month") return null;

                const existingStar = stars.find(
                  (star) =>
                    star.habit_id === selectedIntention?.id &&
                    new Date(star.date_checked).toDateString() === date.toDateString()
                );

                const today = new Date();
                today.setHours(0,0,0,0);

                const isPastOrToday = date <= today;

                const showChallengeMarker = isChallengeDay(date);

                return (
                  <div style={{ textAlign: "center", marginTop: "2px" }}>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        if (existingStar) {
                          handleDeleteStar(existingStar.id);
                        } else {
                          createStar(date);
                        }
                      }}
                      style={{
                        display: "inline-block",
                        background: existingStar ? "gold" : "#eee",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                        lineHeight: "16px",
                        textAlign: "center",
                        userSelect: "none",
                        fontSize: "20px",
                        position: "relative",
                      }}
                    >
                      <div
                      style={{
                        position: "absolute",
                        top: "-1px",
                        left: "-10px",
                        fontSize: "25px"
                      }}>
                        {existingStar ? "⭐" : ""}
                        {/* {showChallengeMarker ? "yes" : ""} */}
                      </div>
                      
                    </span>
                      {showChallengeMarker ? (
                        <div className="edit-detail">
                          challenge day
                          
                        </div>
                      ) : (
                        <div>
                          
                        </div>
                      )}
                      {/* {isPastOrToday ? (
                        <div className="edit-detail">
                          {existingStar ? "edit" : "more"}
                          
                        </div>
                      ) : (
                        <div className="edit-detail">
                          
                        </div>
                      )} */}
                  </div>
                );
              }}
            />
          </div>
          
          
          <div>
            {/* <ul>
              {stars.map((star) => (
                <li key={star.id}>
                  Habit id: {star.habit_id} Habit: | Date: {star.date_checked} | Level: {star.check_level}
                  <button
                    style={{ marginLeft: '10px', color: 'red' }}
                    onClick={() => handleDeleteStar(star.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul> */}
          </div>
          <div>
            <span>See challenges for</span>

            {selectedIntention && (
              <span> {selectedIntention.intention}</span>
            )}

            <ul>
              {challenges.map((item) => (
                <li 
                  key={item.id}
                  onClick={() => setSelectedChallenge(item)}
                  className='wins-intention-item'
                >
                  {selectedIntention.intention} {item.target_count} times in {item.period_days} days for {item.duration_days} days.
                  Starting on {item.start_date}, ending on {item.end_date}
                </li>
              ))}
            </ul>

            
          </div>
        </div>
        <div className='intention-list-box'>
          <h3>Your Intentions:</h3>
          <p>will have an option for All intentions, to acquire, to quit</p>
          {intentions.length === 0 && <p>No intentions yet.</p>}
          <ul>
            {intentions.map((item) => (
              <li 
                key={item.id}
                className='wins-intention-item'
                onClick={() => {setSelectedIntention(item), setSelectedChallenge(null)}} 
                
              >
                {item.intention} {item.to_quit ? "(Quit)" : ""}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
    
      
    </>
  )
}

export default Wins 