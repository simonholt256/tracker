import {NavLink } from 'react-router-dom';

function LoggedOutWelcome(state) {

  return (
    <div className="welcome-bar">
      <p>Welcome, you are not signed in</p>
      <div className=".welcome-bar-interact">
          <>
            <NavLink to="/signin" className="welcome-signin">
              Sign In
            </NavLink>
            <NavLink to="/signup" className="welcome-signup">
              Sign Up
            </NavLink>
            <NavLink to="/" className="welcome-signup">
              Dahsboard
            </NavLink>
          </>
      </div>
    </div>
  );
}

export default LoggedOutWelcome