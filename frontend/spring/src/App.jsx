import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Home from "./pages/Home";
import HomeLogin from "./pages/HomeLogin";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Wins from "./pages/Wins";
import Awards from "./pages/Awards";
import Add from "./pages/Add";
import Profile from "./pages/Profile";
import './App.css'



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
