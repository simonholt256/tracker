import React, { useEffect, useState} from 'react';
import axios from 'axios';

import '../../cssStyles/Home.css'

import Trophy1 from '../../assets/trophies/trophy1.png'
import Trophy2 from '../../assets/trophies/trophy2.png'
import Trophy3 from '../../assets/trophies/trophy3.png'
import Trophy4 from '../../assets/trophies/trophy4.png'
import Trophy5 from '../../assets/trophies/trophy5.png'
import Trophy6 from '../../assets/trophies/trophy6.png'

function AchievementDisplay () {

  const [challenges, setChallenges] = useState([])
  const [intentions, setIntentions] = useState([])
  const [stars, setStars] = useState([])

  const [selectedTrophy, setSelectedTrophy] = useState([])
    
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

    fetchIntentions();
    fetchStars();
    fetchChallenges();
    
  }, [token]);

  const activeChallenges = challenges.filter(c => c.status === "active");
  const completedChallenges = challenges.filter(c => c.status !== "active");

  return (
    <>
      <div className="card home-wins-box">
        <div className='tab-small-wins'></div>
        {/* display awards or stars if you dont have any awards, if none at all, have Add buttons */}
        <div className='awards-title'>Awards</div>
        <div className='home-cabinet'>
          {challenges.map((item) => 
            item.status === "completed" ? (
            <img className='cabinet-trophy-home' src={trophyMap[item.trophy_id]} key={item.id} onClick={() => setSelectedTrophy(item)}></img>
          ): null
        )}
        </div>
        <div className='trophy-info'> 
          {selectedTrophy.length === 0 ? (<div>Select a trophey</div>
            ) : (
            <div>Make this the actuall intention - {selectedTrophy.intention_id} - {selectedTrophy.target_count} times in {selectedTrophy.period_days} days for {selectedTrophy.duration_days} days.</div>
          )}
          
        </div>
        <div className='stats'>
          <div>
            <div>Live intentions: {intentions.length}</div>
            <div>total stars: {stars.length}</div>
          </div>
          <div>
            <div>Active challenges: {activeChallenges.length}</div>
            <div>Completed challenges: {completedChallenges.length}</div>
          </div>
         
        </div>
        
      </div>
    </>
  )
}

export default AchievementDisplay