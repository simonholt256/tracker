import React, { useState } from 'react';
import axios from 'axios';

import Header from '../components/header/Header';
import LoggedOutWelcome from '../components/header/LoggedOutWelcome';

import '../cssStyles/SignInUp.css'

function SignUp() {

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/users/signup',
        {
          user_name: userName,
          email: email,
          password: password
        }
      );

      setMessage("Signup successful!");
      console.log(response.data);

    } catch (error) {
      console.error(error);
      setMessage("Signup failed.");
    }
  };

  return (
    <>
      <Header/>
      <LoggedOutWelcome/>
      <div className='sign-in-box'>
        <h1 className='sign-in-title'>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className='sign-in-input'>
            <label>Username:</label>
            <input
              type="text"
              value={userName}
              autoComplete="username"
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div className='sign-in-input'>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              autoComplete="new-email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='sign-in-input'>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className='purple-button' type="submit">Sign Up</button>
        </form>
      </div>
      

      {message && <p>{message}</p>}
    </>
  );
}

export default SignUp;