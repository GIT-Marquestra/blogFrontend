import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/Hero";
import Signup from "./components/Signup";
import { Navbar } from "./components/Navbar";
import SignIn from "./components/SignIn";
import HomePage from "./components/Home";
import { Toaster } from "react-hot-toast"



// Routing here
function App() {
    return (
        <div>
            <Router>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<LandingPage/>}/>
                    <Route path="/home" element={<HomePage/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/signin" element={<SignIn/>}/>
                </Routes>
            </Router>
            <Toaster/>

        </div>
    )
  
}

export default App