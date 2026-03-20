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

  return (
    <>
      <div className="card home-wins-box">
        {/* display awards or stars if you dont have any awards, if none at all, have Add buttons */}
        Trophy
        <div className='home-cabinet'>
          {challenges.map((item) => 
            item.status === "completed" ? (
            <img className='cabinet-trophy' src={trophyMap[item.trophy_id]} key={item.id}></img>
          ): null
        )}
        </div>
        <div className='stats'>
          <div>Number of intentions: 10</div>
          <div>total stars: 100</div>
          <div>Active challenges: 5</div>
          <div>Completed challenges: 3</div>
        </div>
        
      </div>
    </>
  )
}

export default AchievementDisplay