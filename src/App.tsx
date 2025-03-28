import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/Hero";
import Signup from "./components/Signup";
import { Navbar } from "./components/Navbar";
import SignIn from "./components/SignIn";
// import Log from "./pages/loginSignup.jsx";




function App() {
    return (
        <div>
            <Router>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<LandingPage/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/signin" element={<SignIn/>}/>
                </Routes>
            </Router>

        </div>
    )
  
}

export default App