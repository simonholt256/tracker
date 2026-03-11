import React, { useEffect, useState } from 'react';
import axios from 'axios';

import '../../cssStyles/Home.css'

function MyIntentionsHome () {
  const [intentions, setIntentions] = useState([]);
  
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
    
    <div className="card">
      <h3>Intentions:</h3>
        {intentions.length === 0 && <p>No intentions yet, add something above</p>}
        <ul>
          {intentions.map((item) => (
            <li className='home-intention' key={item.id}>
              {item.intention} {item.to_quit ? "(Quit)" : ""}
            </li>
          ))}
        </ul>
    </div>
    
  )
}

export default MyIntentionsHome