import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Header from '../components/header/Header';
import Navbar from '../components/header/Navbar';
import UserWelcomeBar from '../components/header/UserWelcomeBar';

import WinsCalendar from '../components/wins/WinsCalendar';

import Calendar from 'react-calendar';

// import 'react-calendar/dist/Calendar.css';
import '../cssStyles/Progress.css'
import '../cssStyles/Calendar.css'

function Progress () {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('')
  const [intentions, setIntentions] = useState([]);
  const [selectedIntention, setSelectedIntention] = useState(null);

  const [stars, setStars] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const [filter, setFilter] = useState("all");


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

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

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

  const filteredIntentions = intentions.filter((item) => {
    if (filter === "do") return item.to_quit === false;
    if (filter === "dont") return item.to_quit === true;
    return true; // "all"
  });

  const activeChallenges = challenges.filter(c => c.status === "active");
  const completedChallenges = challenges.filter(c => c.status !== "active");

  return (
    <>
      <Header/>
      <Navbar/>
      <UserWelcomeBar currentUserName={userName}/>
      <div className='progress-page'>
        <h1 className='progress-title'>--- Progress ---</h1>
        <div className='progress-file-border'>
          <div className='progress-tab-box'>
            <button className='progress-tab'>Calendar</button>
            <button className='progress-tab progress-tab-behind'>More options</button>
          </div>
          <div className='progress-block' >
            <div className='intention-list-box'>
              <h3 className='your-intention'>Your Intentions:</h3>
              <div className='all-do-box'>
                <button
                  className={`all ${filter === "all" ? "active" : ""}`}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>

                <button
                  className={`do ${filter === "do" ? "active" : ""}`}
                  onClick={() => setFilter("do")}
                >
                  Do!
                </button>

                <button
                  className={`dont ${filter === "dont" ? "active" : ""}`}
                  onClick={() => setFilter("dont")}
                >
                  Don't do!
                </button>
              </div>
              {/* <p>will have an option for All intentions, to acquire, to quit</p> */}
              {intentions.length === 0 && <p>No intentions yet.</p>}
              <div className='list-box-div'>
                <ul>
                  {filteredIntentions.map((item) => (
                    <li
                      key={item.id}
                      className={`progress-intention-item ${
                        selectedIntention?.id === item.id ? 'selected' : ''
                      }`}
                      onClick={() => {setSelectedIntention(item), setSelectedChallenge(null)}}

                    >
                      - {item.intention} {item.to_quit ? "(Quit)" : ""}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
            <div className='calendar-display-box'>
              <div className='choose-challenge-box'>
                {selectedIntention && (
                  <div className='chosen-intent-title'>Intention: {selectedIntention.intention}</div>
                )}
                <div className='select-challenges-box'>
                   <div>Active challenges: {activeChallenges.length}</div>
                  <select
                    className="progress-challenge-dropdown"
                    onChange={(e) => {
                      const selected = challenges.find(c => c.id === Number(e.target.value));
                      setSelectedChallenge(selected || null);
                    }}
                    value={selectedChallenge?.id || ""}
                  >
                    {challenges.length === 0 ? (
                      <option value="">No challenges available</option>
                    ) : (
                      <>
                        <option value="">Select a challenge</option>

                        {activeChallenges.length > 0 && (
                          <optgroup label="Active">
                            {activeChallenges.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.target_count} times every {item.period_days} days, for {item.duration_days} days
                              </option>
                            ))}
                          </optgroup>
                        )}

                        {completedChallenges.length > 0 && (
                          <optgroup label="Completed">
                            {completedChallenges.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.target_count} times every {item.period_days} days, for {item.duration_days} days
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </>
                    )}
                  </select>
                </div>


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
                      
                      <div className='date-box'>
                        
                        <span className={`date-box-span ${existingStar ? "date-box-span-used" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (existingStar) {
                              handleDeleteStar(existingStar.id);
                            } else {
                              createStar(date);
                            }
                          }}
                          
                        >
                          <div className='star'
                          style={{
                            position: "absolute",
                            top: "-1px",
                            left: "-9px",
                            fontSize: "25px"
                          }}>
                            {existingStar ? "⭐" : ""}
                            
                          </div>
                          

                        </span>
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
              {/* <div className='challenges'>
                <span>See challenges for</span>

                {selectedIntention && (
                  <span> {selectedIntention.intention}</span>
                )}

                <ul className='progress-challenge-item-ul'>
                  {challenges.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => setSelectedChallenge(item)}
                      className='progress-challenge-item'
                      style={{ background: item.status == "active" ? '#f9ffbf' : '#9fff7e'}}
                    >
                      {selectedIntention.intention} {item.target_count} times in {item.period_days} days for {item.duration_days} days.
                      Starting on {item.start_date.split("T")[0]}. {item.status}
                    </li>
                  ))}
                </ul>



              </div> */}
            </div>
          </div>


        </div>
      </div>




    </>
  )
}

export default Progress