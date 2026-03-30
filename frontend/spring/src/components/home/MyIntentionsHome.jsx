import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Stargold from '../../assets/stargold.png'
import Starblank from '../../assets/starblank.png'
import Halfstargold from '../../assets/halfstargold.png'
import Halfstarblank from '../../assets/halfstarblank.png'
import Passcolour from '../../assets/passcolour.png'
import Passblank from '../../assets/passblank.png'

import '../../cssStyles/HomeIntentions.css'

function MyIntentionsHome () {
  const [intentions, setIntentions] = useState([]);
  const [stars, setStars] = useState([])

  const [currentCarouselIndex, setCarouselCurrentIndex] = useState(0);
  
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

    fetchIntentions();
    fetchStars();
  }, [token]);

  const createStar = async (habitID, date) => {


    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/stars/",
        {
          habit_id: habitID,
          date_checked: date,
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

  return (
    
    <div className="card home-intentions">
      
      <div className='carousel-box'>

        <button className='carousel-button prev'
            onClick={() =>
              setCarouselCurrentIndex(prev => (prev === 0 ? intentions.length - 1 : prev - 1))
            }
          >&#8678;</button>
          
        <div className='carousel'>
          {intentions.length === 0 && <p>No intentions yet, add something above</p>}
          <ul
            className="slide-ul"
            style={{
              transform: `translateX(-${currentCarouselIndex * 100}%)`,
              transition: "transform 0.5s ease"
            }}
          >
            {intentions.map((item) => {
              const today = new Date().toISOString().split('T')[0];

              const existingStar = stars.find(star => 
                star.habit_id === item.id &&
                star.date_checked === today
              );

              const hasStarToday = !!existingStar;

              return (
                <li className="slide" key={item.id}>
                  <div className='home-intentions-split'>
                    <div className='intention-group'>
                      
                        <div className='intention-in-slide'>
                        {item.intention} {item.to_quit ? "(Quit)" : ""}
                        </div>
                        <div className='intention-info' >
                          intention info, No. of stars, date started
                        </div>
                        
                      
                      
                    </div>
                    
                    <div className='done-it-box'>
                      <div>{hasStarToday ? "Remove" : "Add a"} Star</div>
                      <button className='star-button'
                      
                      onClick={(e) => {
                            e.stopPropagation();
                            if (hasStarToday) {
                              handleDeleteStar(existingStar.id);
                            } else {
                              createStar(item.id, today);
                            }}}

                      >
                        {hasStarToday ? (
                          <img className='star-pic' src={Stargold} ></img>
                        ) : (
                          <img className='star-pic' src={Starblank} ></img>
                        ) }
                        
                      </button>
                      
                      <div>for today!</div>
                    </div>
                    <div className='half-pass-box'>
                      <button className='half-star-button'>
                        <img className='half-star-pic' src={Halfstarblank}></img>
                      </button>
                      
                      <button className='pass-button'>
                        <img className='pass-pic' src={Passblank}></img>
                      </button>
                    </div>
                  </div>
                  
                </li>
              )
            })}
          </ul>
          
          
        </div>
        <button className='carousel-button next'
          onClick={() =>
            setCarouselCurrentIndex(prev => (prev === intentions.length - 1 ? 0 : prev + 1))
          }
        >&#8680;</button>  
      </div>  
    </div>
    
  )
}

export default MyIntentionsHome