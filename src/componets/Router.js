import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Profile from 'routes/Profile';
import Navigation from './Navigation';
import {useHistory} from "react-router-dom";

const AppRouter = ({ isLoggin, userObj, refreshUser }) => {
  
    return (
        <Router>
            {isLoggin && <Navigation userObj={userObj}/> /** 로그인 되었을때 항상 보여지도록*/} 
            <Routes>
                {isLoggin ? (
                    <>
                    <Route exact path="/" element={<Home userObj={userObj} /> } />
                    <Route exact path="/profile" element={<Profile refreshUser={refreshUser} userObj={userObj}/> } />
                    
                    </>
                ) : (
                    <>
                    <Route exact path="/" element={<Auth />} />
                    </>
                )}                
            </Routes>
        </Router>
    );
} 

export default AppRouter;