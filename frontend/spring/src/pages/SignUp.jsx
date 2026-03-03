import React, { useState } from 'react';
import axios from 'axios';

import Header from '../components/header/Header';
import LoggedOutWelcome from '../components/header/LoggedOutWelcome';

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
      <h1>Sign Up</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Sign Up</button>
      </form>

      {message && <p>{message}</p>}
    </>
  );
}

export default SignUp;