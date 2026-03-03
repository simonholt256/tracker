import { useNavigate } from "react-router-dom";

function UserWelcomeBar({currentUserName}) {

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('jwtToken'); // delete JWT
    navigate('/');
  };

  return (
    <div className="welcome-bar">
      <p>Welcome, {currentUserName}</p>
      <div className="sign-in-up-bar">
        <button onClick={handleLogout}>Logout</button>
      </div>
      
    </div>
  );
}

export default UserWelcomeBar