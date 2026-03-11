import '../../cssStyles/Home.css'

function ProfileHome ({userName, userImage, userMantra}) {
  return (
    <>
      <div className="card profile-home">
        <h2>{userName}</h2>
        <p>{userImage}</p>
        <p>{userMantra}</p>
      </div>
    </>
  )
}

export default ProfileHome