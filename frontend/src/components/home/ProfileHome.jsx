import '../../cssStyles/Home.css'

import ProfilePic from '../../assets/standinprofilepic.jpg'

import LightBulb from '../../assets/profile/lightbulbicon.png'
import Rocket from '../../assets/profile/rocketicon.png'
import Flower from '../../assets/profile/flowericon.png'
import Compass from '../../assets/profile/compassicon.png'
import Microscope from '../../assets/profile/microscopeicon.png'
import Fist from '../../assets/profile/fisticon.png'

function ProfileHome ({userName, userImage, userMantra}) {

  const icons = [
      LightBulb,
      Rocket,
      Flower,
      Compass,
      Microscope,
      Fist
    ];

  return (
    <>
      <div className="profilehome">
        <div className='profilehome__tab'></div>
        
        <div className='profilehome__icon-box'>
          <img className='profilehome__icon' src={icons[userImage]}></img>
        </div>
        <div className='profilehome__username-box'>
          <h2 className='profilehome__username'>{userName}</h2>
          <p className='profilehome__mantra'>{userMantra}</p>
        </div>
        
        
      </div>
    </>
  )
}

export default ProfileHome