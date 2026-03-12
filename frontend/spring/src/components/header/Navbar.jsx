import { NavLink } from "react-router-dom"

function Navbar () {
  return (
    <div className="nav-container">
      <NavLink to="/home" className="nav-link">
        Home
      </NavLink>
      <NavLink to="/intentions" className="nav-link">
        Intentions
      </NavLink>
      <NavLink to="/challenges" className="nav-link">
        Challenges
      </NavLink>
      <NavLink to="/progress" className="nav-link">
        Progress
      </NavLink>
      <NavLink to="/wins" className="nav-link">
        Wins
      </NavLink>
      <NavLink to="/profile" className="nav-link">
        Profile
      </NavLink>
    </div>
  )
}

export default Navbar