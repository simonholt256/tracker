import React, { useState, useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';

import Squig from '../../assets/squig.png';
import Spring from '../../assets/spring.png';
import SpringTest from '../../assets/springtest2.png';

import '../../cssStyles/SignInUp.css';

function SignIn() {
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn(email, password);

    if (!result.success) {
      setMessage(result.error);
    }
  };

  return (
    <>
    
      <div className='anchor'>
        {/* <img className='squig' src={Squig}></img> */}
        {/* <img className='spring' src={SpringTest} ></img> */}
      </div>
      <div className='sign-in-box'>
        <h1 className='sign-in-title'>Welcome back!</h1>
        <form onSubmit={handleSubmit}>
          <div className='sign-in-div'>
            {/* <label>Email:</label> */}
            <input className='sign-in-input'
              placeholder='email'
              type="email"
              value={email}
              autoComplete="current-email"
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