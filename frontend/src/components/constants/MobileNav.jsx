import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import HomeIcon from '../../assets/mobileicons/homeicon.svg'
import MissionIcon from '../../assets/mobileicons/missionicon.svg'
import ProfileIcon from '../../assets/mobileicons/profileicon.svg'
import StarIcon from '../../assets/mobileicons/staricon.svg'
import TrophyIcon from '../../assets/mobileicons/trophyicon.svg'

function MobileNav() {
  const { user } = useContext(AuthContext);

  // If no user, hide the nav entirely
  if (!user) return null;

  return (
    <div className="mobilenav">
      <NavLink to="/home" className="mobilenav__link">
        <img src={HomeIcon} className="mobilenav__icon"/>
      </NavLink>
      <NavLink to="/intentions" className="mobilenav__link">
        <img src={MissionIcon} className="mobilenav__icon"/>
      </NavLink>
      <NavLink to="/progress" className="mobilenav__link">
        <img src={StarIcon} className="mobilenav__icon"/>
      </NavLink>
      <NavLink to="/wins" className="mobilenav__link">
        <img src={TrophyIcon} className="mobilenav__icon"/>
      </NavLink>
      <NavLink to="/profile" className="mobilenav__link">
        <img src={ProfileIcon} className="mobilenav__icon"/>
      </NavLink>
    </div>
  );
}

export default MobileNav;
