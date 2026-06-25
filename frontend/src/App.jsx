import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Home from "./pages/Home";
import HomeLogin from "./pages/HomeLogin";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Progress from "./pages/Progress";
import ChallengesPage from "./pages/ChallengesPage";
import IntentionsPage from "./pages/IntentionsPage";
import Profile from "./pages/Profile";
import Wins from "./pages/Wins";



import './cssStyles/App.css'



function App() {

  return (
    
      
    <div className='back-panel'>
      <div className='whole'>
        
          <Router>
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
          </Router>
        
      </div>
    </div>
      
  )
}

export default App
