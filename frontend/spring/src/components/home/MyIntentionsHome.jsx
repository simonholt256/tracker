import React, { useEffect, useState } from 'react';
import axios from 'axios';

import '../../cssStyles/Home.css'

function MyIntentionsHome () {
  const [intentions, setIntentions] = useState([]);

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
    fetchIntentions();
  }, [token]);

  return (
    
    <div className="card home-intentions">
      <h3>Intentions:</h3>
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
            {intentions.map((item) => (
              <li className="slide" key={item.id}>
                <div className='home-intentions-split'>
                  <div className='intention-in-slide'>
                    {item.intention} {item.to_quit ? "(Quit)" : ""}
                  </div>
                  <div className='done-it-box'>
                    {/* <div className='done-it-today'>{item.to_quit ? "Didn't do it today? " : "Done for today? "}</div> */}
                    <button className='star-button'>Add Star</button>
                    {/* <button className='other-button'>Other</button> */}
                  </div>
                  
                </div>
                
              </li>
            ))}
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