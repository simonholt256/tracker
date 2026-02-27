import InUpSwitch from "../components/InUpSwitch"
import HomeDisplay from "../components/home/HomeDisplay"
import ProfileHome from "../components/home/ProfileHome"

function Home() {
  return (
    <div>
      
        <div>if logged in we want this to dashboard</div>
        <ProfileHome/>
        <HomeDisplay/>
        <h2>Lets get you logged in</h2>
        <InUpSwitch/>
      
      
    </div>
  )
}

export default Home