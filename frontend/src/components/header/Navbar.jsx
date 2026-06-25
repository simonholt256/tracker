import { NavLink } from "react-router-dom"

import StarSmall from '../../assets/Starsmall.png'

function Navbar () {
  return (
    <div className="nav-container">
      <NavLink to="/home" className="nav-link">
        Home
      </NavLink>
      <div className="star-holder">
        <img className="nav-star" src={StarSmall}/>
      </div>
      <NavLink to="/intentions" className="nav-link">
        Intentions
      </NavLink>
      <div className="star-holder">
        <img className="nav-star" src={StarSmall}/>
      </div>
      <NavLink to="/challenges" className="nav-link">
        Challenges
      </NavLink>
      <div className="star-holder">
        <img className="nav-star" src={StarSmall}/>
      </div>
      <NavLink to="/progress" className="nav-link">
        Progress
      </NavLink>
      <div className="star-holder">
        <img className="nav-star" src={StarSmall}/>
      </div>
      <NavLink to="/wins" className="nav-link">
        Wins
      </NavLink>
      <div className="star-holder">
        <img className="nav-star" src={StarSmall}/>
      </div>
      <NavLink to="/profile" className="nav-link">
        Profile
      </NavLink>
    </div>
  )
}

export default Navbar