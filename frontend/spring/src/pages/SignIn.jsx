import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Header from '../components/header/Header';
import LoggedOutWelcome from '../components/header/LoggedOutWelcome';

import '../cssStyles/SignInUp.css'

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');


  const navigate = useNavigate(); // used to redirect

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/auth/login',
        { email, password }
      );

      const token = response.data.access_token;
      localStorage.setItem('jwtToken', token); // save JWT

      setMessage("Login successful!");
      navigate('/'); // redirect to dashboard

    } catch (error) {
      console.error(error);
      setMessage("Login failed. Check your email and password.");
    }
  };

  return (
    <>
      <Header/>
      <LoggedOutWelcome/>
      <div className='sign-in-box'>
        <h1 className='sign-in-title'>Sign In</h1>
        <form onSubmit={handleSubmit}>
          <div className='sign-in-input'>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              autoComplete="current-email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='sign-in-input'>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className='purple-button' type="submit">Sign In</button>
        </form>
      </div>

      {message && <p>{message}</p>}
    </>
  );
}

export default SignIn;