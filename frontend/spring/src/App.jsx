import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header'

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/profile";
import UserWelcomeBar from "./components/UserWelcomeBar";
import './App.css'



function App() {

  return (
    <div className='back-panel'>
      <div className='whole'>
        
        <Router>
          <Header/>
          <UserWelcomeBar/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </div>
    </div>
  )
}

export default App
