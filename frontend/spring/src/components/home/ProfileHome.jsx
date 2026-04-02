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
      <div className="profile-home">
        <div className='tab-small-profile'></div>
        <h2 className='name-title'>{userName}</h2>
        <div className='home-profile-pic-box'>
          <img className='home-profile-pic' src={icons[userImage]}></img>
        </div>
        
        <p className='mantra'>{userMantra}</p>
      </div>
    </>
  )
}

export default ProfileHome