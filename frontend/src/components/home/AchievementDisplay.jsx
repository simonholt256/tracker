import React, { useState, useContext } from 'react';

import '../../cssStyles/Home.css';

import Trophy1 from '../../assets/trophies/trophy1.png';
import Trophy2 from '../../assets/trophies/trophy2.png';
import Trophy3 from '../../assets/trophies/trophy3.png';
import Trophy4 from '../../assets/trophies/trophy4.png';
import Trophy5 from '../../assets/trophies/trophy5.png';
import Trophy6 from '../../assets/trophies/trophy6.png';

// CONTEXTS
import { IntentionsContext } from '../../context/IntentionsContext';
import { StarsContext } from '../../context/StarsContext';
import { ChallengesContext } from '../../context/ChallengesContext';

function AchievementDisplay() {

  // CONTEXT DATA
  const { intentions } = useContext(IntentionsContext);
  const { stars } = useContext(StarsContext);
  const { challenges } = useContext(ChallengesContext);

  // LOCAL STATE
  const [selectedTrophy, setSelectedTrophy] = useState(null);

  const trophyMap = {
    1: Trophy1,
    2: Trophy2,
    3: Trophy3,
    4: Trophy4,
    5: Trophy5,
    6: Trophy6
  };

  const activeChallenges = challenges.filter(c => c.status === "active");
  const completedChallenges = challenges.filter(c => c.status !== "active");

  return (
    <>
      <div className="achievementdisplay">
        <div className='achievementdisplay__tabs'></div>

        <div className='achievementdisplay__title'>Awards</div>

        <div className='achievementdisplay__cabinet'>
          {completedChallenges.map((item) => (
            <img
              className='achievementdisplay__trophy'
              src={trophyMap[item.trophy_id]}
              key={item.id}
              onClick={() => setSelectedTrophy(item)}
            />
          ))}
        </div>

        <div className='achievementdisplay__trophy-info'>
          {!selectedTrophy ? (
            <div>Select a trophy</div>
          ) : (
            <div>
              {intentions.find(i => i.id === selectedTrophy.intention_id)?.intention} – 
              {
                selectedTrophy.target_count === 1 && selectedTrophy.period_days === 1
                ? " Everyday"
                : selectedTrophy.target_count === 1 && selectedTrophy.period_days === 7
                ? " Once a week"
                : selectedTrophy.target_count === 1
                ? ` Once every ${selectedTrophy.period_days} days`
                : selectedTrophy.period_days === 7
                ? ` ${selectedTrophy.target_count} times a week`
                : ` ${selectedTrophy.target_count} times every ${selectedTrophy.period_days} days`
              }
              for
              {
                selectedTrophy.duration_days === 7
                ? " a week"
                : selectedTrophy.duration_days === 14
                ? " two weeks"
                : ` ${selectedTrophy.duration_days} days`
              }
            </div>
          )}
        </div>

        <div className='achievementdisplay__stats'>
          <div>
            <div>Live intentions: {intentions.length}</div>
            <div>Total stars: {stars.length}</div>
          </div>
          <div>
            <div>Active challenges: {activeChallenges.length}</div>
            <div>Completed challenges: {completedChallenges.length}</div>
          </div>
        </div>

      </div>
    </>
  );
}

export default AchievementDisplay;
