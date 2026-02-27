import { NavLink } from "react-router-dom"

function Navbar () {
  return (
    <div className="nav-container"> only show when signed in
      <NavLink to="/" className="nav-link">
        Home/Dashboard
      </NavLink>
      <NavLink to="/wins" className="nav-link">
        Wins
      </NavLink>
      <NavLink to="/awards" className="nav-link">
        awards
      </NavLink>
      <NavLink to="/add" className="nav-link">
        Add
      </NavLink>
      <NavLink to="/profile" className="nav-link">
        Profile
      </NavLink>
    </div>
  )
}

export default Navbar