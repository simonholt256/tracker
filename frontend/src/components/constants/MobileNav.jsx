import { NavLink } from "react-router-dom"

function MobileNav() {
  return (
    <>
      <div className="mobilenav">
        <NavLink to="/home" className="mobilenav__link">
          Home
        </NavLink>
        <NavLink to="/intentions" className="mobilenav__link">
          Missions
        </NavLink>
        <NavLink to="/progress" className="mobilenav__link">
          Progress
        </NavLink>
        <NavLink to="/wins" className="mobilenav__link">
          Wins
        </NavLink>
        <NavLink to="/profile" className="mobilenav__link">
          Profile
        </NavLink>
      </div>
    </>
  )

}

export default MobileNav