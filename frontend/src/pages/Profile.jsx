import React, { useState, useContext } from 'react';
import { UserInfoContext } from '../context/UserInfoContext';

import LightBulb from '../assets/profile/lightbulbicon.png';
import Rocket from '../assets/profile/rocketicon.png';
import Flower from '../assets/profile/flowericon.png';
import Compass from '../assets/profile/compassicon.png';
import Microscope from '../assets/profile/microscopeicon.png';
import Fist from '../assets/profile/fisticon.png';

import '../cssStyles/Profile.css';

function Profile() {
  const { user, updateUser } = useContext(UserInfoContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(1);
  const [selectedMantra, setSelectedMantra] = useState('');

  const iconIndex = user.icon_image ? Number(user.icon_image) : 0;
  const mantraText = user.mantra || "Don’t let perfect be the enemy of good.";

  const icons = [
    LightBulb,
    Rocket,
    Flower,
    Compass,
    Microscope,
    Fist
  ];

  const mantras = [
    "Don’t let perfect be the enemy of good.",
    "A mountain is climbed one step at a time.",
    "Rome wasn’t built in a day.",
    "Do it for her.",
    "I am greater than my highs and lows.",
    "I do it anywaaayyy."
  ];

  if (!user) {
    return (
      <>
        <Header />
        <Navbar />
        <div className="profile-page">
          <h2>Loading profile...</h2>
        </div>
      </>
    );
  }

  return (
    <>

      <div className='profile-page'>
        <div className='profile-info-box'>
          <div className='tab-profile'></div>
          <h1 className='profile-title'>--- Profile ---</h1>

          <div className='profile-pic-box'>
            <img className='profile-pic' src={icons[iconIndex]} alt="Profile Icon" />
          </div>

          <div className='name-mantra'>
            <div className='segment'>
              <div className='mantra-title'>Username:</div>
              <h2>{user.user_name}</h2>
            </div>

            <div className='segment'>
              <div className='mantra-title'>Mantra:</div>
              <div className='profile-mantra'>{mantraText}</div>
            </div>
          </div>

          <button
            className='edit-button'
            onClick={() => {
              setEditName(user.user_name);
              setSelectedIcon(user.icon_image);
              setSelectedMantra(user.mantra);
              setIsEditing(true);
            }}
          >
            Edit profile
          </button>
        </div>

        {isEditing && (
          <div className="edit-profile-box">
            <h3>Username</h3>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Username"
            />

            <h3>Select Icon</h3>
            <div className="icon-grid">
              {icons.map((icon, i) => (
                <img
                  key={i}
                  src={icon}
                  onClick={() => setSelectedIcon(i)}
                  style={{
                    padding: "4px",
                    margin: "4px",
                    border: selectedIcon === i ? "2px solid yellow" : "none",
                    cursor: "pointer",
                    width: 50
                  }}
                />
              ))}
            </div>

            <h3>Select Mantra</h3>
            <div className="mantra-list">
              {mantras.map((m, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedMantra(m)}
                  style={{
                    padding: 8,
                    border: selectedMantra === m ? "2px solid green" : "1px solid gray",
                    cursor: "pointer"
                  }}
                >
                  {m}
                </div>
              ))}
            </div>

            <button
              onClick={async () => {
                await updateUser({
                  user_name: editName,
                  mantra: selectedMantra,
                  icon_image: String(selectedIcon)
                });

                setIsEditing(false);
              }}
            >
              Save
            </button>

            <button
              className='challenge-close-button'
              onClick={() => setIsEditing(false)}
            >
              x
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;
