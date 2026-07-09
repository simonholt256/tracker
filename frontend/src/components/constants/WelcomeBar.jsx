import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { UserInfoContext } from "../../context/UserInfoContext";

function WelcomeBar() {
  const { user: authUser, signOut } = useContext(AuthContext);
  const { user: userDetails } = useContext(UserInfoContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
  };

  // Not logged in
  if (!authUser) {
    return (
      <div className="welcome-bar">
        <p>Welcome, you are not signed in</p>

        <div className="welcome-bar-interact">
          <NavLink to="/signin" className="welcome-signin">Sign In</NavLink>
          <NavLink to="/signup" className="welcome-signup">Sign Up</NavLink>
          <NavLink to="/" className="welcome-signup">Dashboard</NavLink>
        </div>
      </div>
    );
  }

  // Logged in but user details still loading
  if (!userDetails) {
    return (
      <div className="welcome-bar">
        <p>Loading your profile...</p>
      </div>
    );
  }

  // Logged in + user details loaded
  return (
    <div className="welcome-bar">
      <p>Welcome, {userDetails.user_name}</p>

      <div className="welcome-bar-interact">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default WelcomeBar;