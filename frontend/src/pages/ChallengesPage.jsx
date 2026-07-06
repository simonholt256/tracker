import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChallengesContext } from '../context/ChallengesContext';
import { IntentionsContext } from '../context/IntentionsContext';

import Trophy1 from '../assets/trophies/trophy1.png';
import Trophy2 from '../assets/trophies/trophy2.png';
import Trophy3 from '../assets/trophies/trophy3.png';
import Trophy4 from '../assets/trophies/trophy4.png';
import Trophy5 from '../assets/trophies/trophy5.png';
import Trophy6 from '../assets/trophies/trophy6.png';

import Rosette from '../assets/rosette.png';

import '../cssStyles/Intentions.css';

function ChallengesPage() {
  const navigate = useNavigate();

  const { intentions } = useContext(IntentionsContext);

  const {
    challenges,
    createChallenge,
    loadingChallenges,
    errorChallenges
  } = useContext(ChallengesContext);

  const [addChallengeVisible, setAddChallengeVisible] = useState(false);

  const [intentionChoice, setIntentionChoice] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [duration, setDuration] = useState(7);
  const [targetCount, setTargetCount] = useState(1);
  const [periodDays, setPeriodDays] = useState(1);
  const [frequency, setFrequency] = useState('1-1');

  const [daySelection, setDaySelection] = useState('all');
  const [strict, setStrict] = useState(true);
  const [trophyId, setTrophyId] = useState(1);

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
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleCreateChallenge = async () => {
    if (!intentionChoice) {
      alert("Please select an intention first");
      return;
    }

    const challengeData = {
      intention_id: intentionChoice,
      start_date: startDate,
      duration_days: duration,
      target_count: targetCount,
      period_days: periodDays,
      strict: strict,
      trophy_id: trophyId,
      status: "active"
    };

    const result = await createChallenge(challengeData);

    if (result.success) {
      setAddChallengeVisible(false);
    } else {
      alert(result.error);
    }
  };

  return (
    <>
      <div className='challenges-page'>
        <div className='first-column'>
          <img className='rosette' src={Rosette} alt="rosette" />
        </div>

        <div>
          <h3 className='challenge-list-title'>Challenges:</h3>

          {loadingChallenges && <p>Loading challenges...</p>}
          {errorChallenges && <p>{errorChallenges}</p>}

          {challenges.length === 0 && <p>No challenges yet, add something above</p>}

          <ul className='challenges-display-box'>
            {challenges.map((item) => (
              <li className='set-intention' key={item.id}>
                <div className='challenge-box'>
                  <div>
                    <div>{intentions.find(i => i.id === item.intention_id)?.intention}</div>
                    <div>{item.target_count} times in {item.period_days} days for {item.duration_days} days.</div>
                    <div>Starting on {item.start_date?.split('T')[0]}</div>
                  </div>
                  <div>{item.status}</div>
                  <div>
                    <img className='trophy-small' src={trophyMap[item.trophy_id]} alt="trophy" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className='third-column'>
          <button
            className='add-challenge-button'
            onClick={() => setAddChallengeVisible(prev => !prev)}
          >
            Add a challenge
          </button>

          {addChallengeVisible && (
            <div className='add-box'>
              <h2 className='add-title'>Add a Challenge</h2>

              <div>
                <select
                  className='selecting-intention'
                  value={intentionChoice}
                  onChange={(e) => setIntentionChoice(parseInt(e.target.value))}
                >
                  <option value="">Select your intention</option>
                  {intentions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.intention} {item.to_quit ? "(Quit)" : ""}
                    </option>
                  ))}
                </select>
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
                    setFrequency(e.target.value);
                  }}
                >
                  <option value="1-1">Everyday</option>
                  <option value="5-7">5 days a week</option>
                  <option value="3-7">3 times a week</option>
                  <option value="2-7">2 times a week</option>
                  <option value="1-7">Once a week</option>
                </select>

                <span> for </span>

                <select
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                >
                  <option value="7">a week</option>
                  <option value="14">2 weeks</option>
                  <option value="21">3 weeks</option>
                  <option value="28">4 weeks</option>
                </select>
              </div>

              {frequency === "1-1" && (
                <div>
                  <input
                    type="radio"
                    name="daySelection"
                    value="all"
                    checked={daySelection === 'all'}
                    onChange={() => {
                      setDaySelection('all');
                      setTargetCount(1);
                      setPeriodDays(1);
                    }}
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
                      setPeriodDays(7);
                    }}
                  />
                  <label>Weekdays only</label>
                </div>
              )}

              <div>CHOOSE YOUR TROPHY</div>

              <div className='select-trophy-box'>
                {[Trophy1, Trophy2, Trophy3, Trophy4, Trophy5, Trophy6].map((trophy, index) => {
                  const id = index + 1;
                  return (
                    <img
                      key={id}
                      src={trophy}
                      className={`trophy-small-select ${trophyId === id ? "selected-trophy" : ""}`}
                      onClick={() => setTrophyId(id)}
                      alt="trophy"
                    />
                  );
                })}
              </div>

              <button
                className='add-button'
                onClick={handleCreateChallenge}
              >
                Add Challenge
              </button>

              <button
                className='challenge-close-button'
                onClick={() => setAddChallengeVisible(false)}
              >
                x
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ChallengesPage;
