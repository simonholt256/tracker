import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

import Header from "../components/header/Header";
import ProfileHome from "../components/home/ProfileHome";
import AchievementDisplay from "../components/home/AchievementDisplay";
import MyIntentionsHome from '../components/home/MyIntentionsHome';
import ExtraInfo from "../components/home/ExtraInfo";

import '../cssStyles/Home.css';

function Home() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user, redirect handled by AuthContext or router
  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <>
      
      <> 
        
        <div className="home">
          <div className="home__box-top">
            <ProfileHome
              userName={user.user_name}
              userImage={user.icon_image}
              userMantra={user.mantra}  
            />
            <AchievementDisplay/>
          </div>
          <div className="home__box-bottom">
            <MyIntentionsHome/>
            <ExtraInfo/>
            <div>
              <div className="home__method-card copy-card">
                <div>Method</div>
                <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</div>
              </div>
              <div className="home__who-for-card copy-card">
                <div>Who's it for</div>
                <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</div>
              </div>
              <div className="home__ethos-card copy-card">
                <div>Ethos</div>
                <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</div>
              </div>
              <div className="home__more-card copy-card">
                <div>More about us</div>
                <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</div>
              </div>
            </div>
          </div>
        </div>
         
      </>
      
    </>
  )
}

export default Home