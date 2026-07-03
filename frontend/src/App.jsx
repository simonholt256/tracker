import { Routes, Route } from "react-router-dom";


import Home from "./pages/Home";
import HomeLogin from "./pages/outside/HomeLogin";
import SignIn from "./pages/outside/SignIn";
import SignUp from "./pages/outside/SignUp";
import Progress from "./pages/Progress";
import ChallengesPage from "./pages/ChallengesPage";
import IntentionsPage from "./pages/IntentionsPage";
import Profile from "./pages/Profile";
import Wins from "./pages/Wins";

import Header from "./components/header/Header";
import WelcomeBar from "./components/header/WelcomeBar";
import Navbar from "./components/header/Navbar";
import MobileNav from "./components/header/MobileNav";



import './cssStyles/App.css'



function App() {

  return (
     
    <div className='back-panel'>
      <div className='whole'>
        <Header/>
        <Navbar/>
        <WelcomeBar/>

          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<HomeLogin />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/intentions" element={<IntentionsPage />} />
            <Route path="/wins" element={<Wins />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        <MobileNav/>
      </div>
    </div>
      
  )
}

export default App
