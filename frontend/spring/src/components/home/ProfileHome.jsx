import '../../cssStyles/Home.css'

import ProfilePic from '../../assets/standinprofilepic.jpg'

function ProfileHome ({userName, userImage, userMantra}) {
  return (
    <>
      <div className="card profile-home">
        <h2>{userName}</h2>
        <img className='home-profile-pic' src={ProfilePic}></img>
        <p className='mantra'>{userMantra}</p>
      </div>
    </>
  )
}

export default ProfileHome