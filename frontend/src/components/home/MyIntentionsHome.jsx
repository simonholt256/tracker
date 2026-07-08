import React, { useState, useContext } from 'react';

import Stargold from '../../assets/stargold.png';
import Starblank from '../../assets/starblank.png';
import Halfstargold from '../../assets/halfstargold.png';
import Halfstarblank from '../../assets/halfstarblank.png';
import Passcolour from '../../assets/passcolour.png';
import Passblank from '../../assets/passblank.png';

import '../../cssStyles/HomeIntentions.css';

// CONTEXTS
import { IntentionsContext } from '../../context/IntentionsContext';
import { StarsContext } from '../../context/StarsContext';

function MyIntentionsHome() {

  // CONTEXT DATA
  const { intentions } = useContext(IntentionsContext);
  const { stars, createStar, deleteStar } = useContext(StarsContext);

  // LOCAL STATE
  const [currentCarouselIndex, setCarouselCurrentIndex] = useState(0);

  // Handle star click (same logic, but using context functions)
  const handleStarClick = async (level, existingStar, itemId, today) => {
    if (existingStar) {
      if (existingStar.check_level === level) {
        await deleteStar(existingStar.id);
      } else {
        await deleteStar(existingStar.id);
        await createStar({
          habit_id: itemId,
          date_checked: today,
          check_level: level
        });
      }
    } else {
      await createStar({
        habit_id: itemId,
        date_checked: today,
        check_level: level
      });
    }
  };

  return (
    <div className="card home-intentions">
      <div className='carousel-box'>

        {/* PREV BUTTON */}
        <button
          className='carousel-button prev'
          onClick={() =>
            setCarouselCurrentIndex(prev =>
              prev === 0 ? intentions.length - 1 : prev - 1
            )
          }
        >
          &#8678;
        </button>

        {/* CAROUSEL */}
        <div className='carousel'>
          {intentions.length === 0 && (
            <p>No intentions yet, add something above</p>
          )}

          <ul
            className="slide-ul"
            style={{
              transform: `translateX(-${currentCarouselIndex * 100}%)`,
              transition: "transform 0.5s ease"
            }}
          >
            {intentions.map((item) => {
              const today = new Date().toISOString().split('T')[0];

              const existingStar = stars.find(
                star =>
                  star.habit_id === item.id &&
                  star.date_checked === today
              );

              return (
                <li className="slide" key={item.id}>
                  <div className='home-intentions-split'>
                    <div className='intention-group'>
                      <div className='intention-in-slide'>
                        {item.intention} {item.to_quit ? "(Quit)" : ""}
                      </div>

                      <div className='intention-info'>
                        <div>Started: {item.created_at.split('T')[0]}</div>
                        <div>
                          Stars: {stars.filter(star => star.habit_id === item.id).length}
                        </div>
                      </div>
                    </div>

                    {/* STAR BUTTONS */}
                    <div className='select-icon-box'>
                      <div className='done-it-box'>
                        <button
                          className='star-button'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStarClick(1, existingStar, item.id, today);
                          }}
                        >
                          {existingStar?.check_level === 1 ? (
                            <img className='star-pic' src={Stargold} />
                          ) : (
                            <img className='star-pic' src={Starblank} />
                          )}
                        </button>
                      </div>

                      <div className='half-pass-box'>
                        <button
                          className='half-star-button'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStarClick(2, existingStar, item.id, today);
                          }}
                        >
                          {existingStar?.check_level === 2 ? (
                            <img className='half-star-pic' src={Halfstargold} />
                          ) : (
                            <img className='half-star-pic' src={Halfstarblank} />
                          )}
                        </button>

                        <button
                          className='pass-button'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStarClick(3, existingStar, item.id, today);
                          }}
                        >
                          {existingStar?.check_level === 3 ? (
                            <img className='pass-pic' src={Passcolour} />
                          ) : (
                            <img className='pass-pic' src={Passblank} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* NEXT BUTTON */}
        <button
          className='carousel-button next'
          onClick={() =>
            setCarouselCurrentIndex(prev =>
              prev === intentions.length - 1 ? 0 : prev + 1
            )
          }
        >
          &#8680;
        </button>
      </div>
    </div>
  );
}

export default MyIntentionsHome;
