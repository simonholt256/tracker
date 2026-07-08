import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import WinsCalendar from '../components/wins/WinsCalendar';
import Calendar from 'react-calendar';

import '../cssStyles/Progress.css';
import '../cssStyles/Calendar.css';

// CONTEXTS
import { StarsContext } from '../context/StarsContext';
import { ChallengesContext } from '../context/ChallengesContext';
import { IntentionsContext } from '../context/IntentionsContext';

function Progress() {
  const navigate = useNavigate();

  // -----------------------------
  // CONTEXTS
  // -----------------------------
  const { intentions } = useContext(IntentionsContext);
  const { stars, createStar, deleteStar } = useContext(StarsContext);
  const { getChallengesForIntention } = useContext(ChallengesContext);

  // -----------------------------
  // LOCAL STATE (Progress-specific)
  // -----------------------------
  const [userName, setUserName] = useState('');
  const [selectedIntention, setSelectedIntention] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const [filter, setFilter] = useState("all");

  const [addBoxDate, setAddBoxDate] = useState(null);
  const [addCheckLevel, setAddCheckLevel] = useState(1);
  const [addBoxVisable, setAddBoxVisable] = useState(false);

  const token = localStorage.getItem('jwtToken');

  // -----------------------------
  // FETCH USER (still axios)
  // -----------------------------
  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setUserName(data.user_name);
      } catch (error) {
        console.error(error);
        navigate('/');
      }
    };

    fetchUser();
  }, [navigate, token]);

  // -----------------------------
  // SELECT FIRST INTENTION ON LOAD
  // -----------------------------
  useEffect(() => {
    if (intentions.length > 0 && !selectedIntention) {
      setSelectedIntention(intentions[0]);
    }
  }, [intentions, selectedIntention]);

  // -----------------------------
  // STAR HELPERS
  // -----------------------------
  const createStarForDate = async (date, checkLevel) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    await createStar({
      habit_id: selectedIntention.id,
      date_checked: formattedDate,
      check_level: checkLevel
    });
  };

  const getStarForDate = (date) => {
    if (!selectedIntention) return null;

    return stars.find(
      (star) =>
        star.habit_id === selectedIntention.id &&
        new Date(star.date_checked).toDateString() === date.toDateString()
    );
  };

  const hasStar = (date) => {
    if (!selectedIntention) return false;

    return stars.some(
      (star) =>
        star.habit_id === selectedIntention.id &&
        new Date(star.date_checked).toDateString() === date.toDateString()
    );
  };

  const handleDeleteStar = async (starId) => {
    await deleteStar(starId);
  };

  // -----------------------------
  // CHALLENGES FOR SELECTED INTENTION
  // -----------------------------
  const intentionChallenges = selectedIntention
    ? getChallengesForIntention(selectedIntention.id)
    : [];

  const activeChallenges = intentionChallenges.filter(c => c.status === "active");
  const completedChallenges = intentionChallenges.filter(c => c.status !== "active");

  // -----------------------------
  // FILTER INTENTIONS
  // -----------------------------
  const filteredIntentions = intentions.filter((item) => {
    if (filter === "do") return item.to_quit === false;
    if (filter === "dont") return item.to_quit === true;
    return true;
  });

  // -----------------------------
  // MODAL STAR
  // -----------------------------
  const modalStar = stars.find(
    (star) =>
      star.habit_id === selectedIntention?.id &&
      addBoxDate &&
      new Date(star.date_checked).toDateString() === addBoxDate.toDateString()
  );

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <>
      <div className='progress-page'>
        <h1 className='progress-title'>--- Progress ---</h1>

        <div className='progress-file-border'>
          <div className='progress-tab-box'>
            <button className='progress-tab'>Calendar</button>
            <button className='progress-tab progress-tab-behind'>More options</button>
          </div>

          <div className='progress-block'>
            {/* LEFT SIDE — INTENTIONS */}
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

              {intentions.length === 0 && <p>No intentions yet.</p>}

              <div className='list-box-div'>
                <ul>
                  {filteredIntentions.map((item) => (
                    <li
                      key={item.id}
                      className={`progress-intention-item ${
                        selectedIntention?.id === item.id ? 'selected' : ''
                      }`}
                      onClick={() => {
                        setSelectedIntention(item);
                        setSelectedChallenge(null);
                      }}
                    >
                      - {item.intention} {item.to_quit ? "(Quit)" : ""}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* RIGHT SIDE — CALENDAR */}
            <div className='calendar-display-box'>
              <div className='choose-challenge-box'>
                {selectedIntention && (
                  <div className='chosen-intent-title'>
                    Intention: {selectedIntention.intention}
                  </div>
                )}

                <div className='select-challenges-box'>
                  <div>Active challenges: {activeChallenges.length}</div>

                  <select
                    className="progress-challenge-dropdown"
                    onChange={(e) => {
                      const selected = intentionChallenges.find(
                        c => c.id === Number(e.target.value)
                      );
                      setSelectedChallenge(selected || null);
                    }}
                    value={selectedChallenge?.id || ""}
                  >
                    {intentionChallenges.length === 0 ? (
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
                    if (view === "month" && selectedChallenge) {
                      const start = new Date(selectedChallenge.start_date);
                      const end = new Date(selectedChallenge.end_date);
                      start.setHours(0,0,0,0);
                      end.setHours(0,0,0,0);
                      const current = new Date(date);
                      current.setHours(0,0,0,0);
                      if (current >= start && current <= end) {
                        return "challenge-day";
                      }
                    }
                  }}
                  tileContent={({ date, view }) => {
                    if (view !== "month") return null;

                    const existingStar = stars.find(
                      (star) =>
                        star.habit_id === selectedIntention?.id &&
                        new Date(star.date_checked).toDateString() === date.toDateString()
                    );

                    return (
                      <div className='date-box'>
                        <span
                          className={`date-box-span ${existingStar ? "date-box-span-used" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setAddBoxDate(date);
                            setAddCheckLevel(existingStar?.check_level ?? 1);
                            setAddBoxVisable(true);
                          }}
                        >
                          <div
                            className='star'
                            style={{
                              position: "absolute",
                              top: "-1px",
                              left: "-9px",
                              fontSize: "25px"
                            }}
                          >
                            {existingStar?.check_level === 1 ? "⭐" :
                             existingStar?.check_level === 2 ? "🌙" :
                             existingStar?.check_level === 3 ? "🎟️" :
                             ""}
                          </div>
                        </span>
                      </div>
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ADD STAR MODAL */}
        {addBoxVisable && (
          <div className='add-star-modal'>
            <div className='add-box-selection'>
              <button 
                onClick={() => setAddCheckLevel(1)}
                className={`select-intention ${addCheckLevel === 1 ? "active-icon" : ""}`}
              >
                STAR
              </button>

              <button
                onClick={() => setAddCheckLevel(2)} 
                className={`select-intention ${addCheckLevel === 2 ? "active-icon" : ""}`}
              >
                HALF STAR
              </button>

              <button
                onClick={() => setAddCheckLevel(3)} 
                className={`select-intention ${addCheckLevel === 3 ? "active-icon" : ""}`}
              >
                PASS
              </button>

              <button
                onClick={() => setAddCheckLevel(4)}
                className={`select-intention ${addCheckLevel === 4 ? "active-icon" : ""}`}
              >
                NONE
              </button>
            </div>

            <div>
              <div className='add-box-chosen'>
                <button
                  className='challenge-close-button'
                  onClick={() => setAddBoxVisable(false)}
                >
                  x
                </button>

                <div className='selected-image'>
                  {addCheckLevel === 1
                    ? "star"
                    : addCheckLevel === 2
                    ? "half star"
                    : addCheckLevel === 3
                    ? "pass"
                    : addCheckLevel === 4
                    ? "None"
                    : "new star"}
                </div>

                <div>
                  {addCheckLevel}
                  {modalStar?.check_level}
                  {modalStar?.date_checked}
                  {addBoxDate.toDateString()}
                </div>

                <button
                  onClick={async () => {
                    if (modalStar) {
                      await handleDeleteStar(modalStar.id);
                    }

                    if (addCheckLevel !== 4) {
                      await createStarForDate(addBoxDate, addCheckLevel);
                    }

                    setAddBoxVisable(false);
                  }}
                  className='progress-add-button'
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Progress;
