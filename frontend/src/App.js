import { Route, Routes, Router, Navigate } from "react-router-dom";
import Signup from "./components/Signup/Signup.jsx";
import Login from "./components/Login/Login.jsx";
import "./index.css";
import Home from "./components/Home/Home.jsx"
import Planning_poker from "./components/Planning_poker/Planning_poker.js"
import UserStory from "./components/UserStory/UserStory.js"
import History from "./components/History/History.jsx";


function App({ socket }) {
    const user = localStorage.getItem("token");

    return (
        <Routes>
            {user && <Route path="/" exact element={<Home socket={socket} />} />}
            <Route path="/signup" exact element={<Signup />} />
            <Route path="/login" exact element={<Login socket={socket}/>} />
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/planning_poker/:id" element={<Planning_poker socket={socket} animate={true} />} />
            <Route path="/userStory/:id" element={<UserStory socket={socket} animate={true} />} />
            <Route path="/history" exact element={<History socket={socket}/>} />
        </Routes>

    );
}

export default App;