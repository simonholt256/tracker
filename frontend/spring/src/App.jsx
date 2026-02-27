import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/header/Header'

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Wins from "./pages/Wins";
import Awards from "./pages/Awards";
import Add from "./pages/Add";
import Profile from "./pages/profile";
import Navbar from "./components/header/Navbar";
import UserWelcomeBar from "./components/header/UserWelcomeBar";
import './App.css'



function App() {

  return (
    <div className='back-panel'>
      <div className='whole'>
        
        <Router>
          <Header/>
          <Navbar/>
          <UserWelcomeBar/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/wins" element={<Wins />} />
            <Route path="/awards" element={<Awards />} />
            <Route path="/add" element={<Add />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </div>
    </div>
  )
}

export default App
