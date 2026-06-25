import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';

function WinsCalendar() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [stars, setStars] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      navigate('/');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:8000/users/me',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserName(response.data.user_name);
      } catch (error) {
        navigate('/');
      }
    };

    const fetchStars = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:8000/stars/',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStars(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
    fetchStars();
  }, [navigate]);

  // Helper: check if a date has a star
  const hasStar = (date) => {
    return stars.some(
      (star) =>
        new Date(star.date_completed).toDateString() ===
        date.toDateString()
    );
  };

  // Stars for selected date
  const starsForSelectedDate = stars.filter(
    (star) =>
      new Date(star.date_completed).toDateString() ===
      selectedDate.toDateString()
  );


  return (
    <>

      <div style={{ display: 'flex', gap: '40px', padding: '20px' }}>
        
        {/* Calendar */}
        <div>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={({ date, view }) => {
              if (view === 'month' && hasStar(date)) {
                return (
                  <div style={{ textAlign: 'center', color: 'gold' }}>
                    ★
                  </div>
                );
              }
              return null;
            }}
          />
        </div>

        {/* Side Box */}
        <div style={{ border: '1px solid #ccc', padding: '20px', width: '300px' }}>
          <h3>{selectedDate.toDateString()}</h3>

          {starsForSelectedDate.length === 0 && (
            <p>No wins recorded.</p>
          )}

          {starsForSelectedDate.map((star) => (
            <div key={star.id}>
              ⭐ Intention ID: {star.intention_id}
            </div>
          ))}
        </div>

      </div>
    </>
  );
}

export default WinsCalendar;