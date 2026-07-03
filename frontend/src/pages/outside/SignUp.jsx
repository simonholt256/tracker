import React, { useState, useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";

import '../../cssStyles/SignInUp.css';

function SignUp() {
  const { signUp } = useContext(AuthContext);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const result = await signUp({ userName, email, password });

    if (result.success) {
      setMessage("Signup successful!");
    } else {
      setMessage(result.error);
    }
  };

  return (
    <>
    
      <div className='sign-in-box'>
        <h1 className='sign-in-title'>Sign up to get started!</h1>
        <form onSubmit={handleSubmit}>
          <div className='sign-in-div'>
            {/* <label>Username:</label> */}
            <input className='sign-in-input'
              placeholder='Username'
              type="text"
              value={userName}
              autoComplete="username"
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div className='sign-in-div'>
            {/* <label>Email:</label> */}
            <input className='sign-in-input'
              placeholder='Email'
              type="email"
              value={email}
              autoComplete="new-email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='sign-in-div'>
            {/* <label>Password:</label> */}
            <input className='sign-in-input'
              placeholder='Password'
              type="password"
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className='sign-in-div'>
            {/* <label>Confirm Password:</label> */}
            <input className='sign-in-input'
              placeholder='Confirm Password'
              type="password"
              value={confirmPassword}
              autoComplete="new-password"
              onChange={(e) => setConfirmPassword(e.target.value)}
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