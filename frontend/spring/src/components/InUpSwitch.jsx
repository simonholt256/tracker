import { NavLink } from "react-router-dom"

function InUpSwitch() {
  return (
    <div>
      <div className="sign-in-up-bar">
        <NavLink to="/signin" className="auth-link">
          Sign In
        </NavLink>
        <NavLink to="/signup" className="auth-link">
          Sign Up
        </NavLink>
      </div>
    </div>
  )
}

export default InUpSwitch