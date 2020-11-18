import React, {useState,useEffect} from 'react';
import './App.css';
import Home from './components/MyFile';
import Login from './components/Login';
import NavBar from './components/NavBar.js';
import { useAuth0 } from "@auth0/auth0-react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import MyFile from './components/MyFile';

function App() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently} =  useAuth0();
  const [accessToken, setAccessToken] = useState(null);

  

  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = "dev-kz08advs.us.auth0.com";
      try {
        const token = await getAccessTokenSilently({
          audience: `https://localhost:8000`,
          scope: "read:current_user"
        });
        setAccessToken(token);
      } catch (e) {
        console.log(e.message);
      }
    };
    getUserMetadata();
  }, []);

  if(isLoading){
    return(
      <div className='app'>
        Loading....
      </div>
    );
  }

  return (
    <div className="app">
      <Router>
        <NavBar isLoggedIn={isAuthenticated} />
        <Switch>
          <Route path='/login'>
            <Login isLoggedIn={isAuthenticated}/>
          </Route>
          <Route path='/myfile'>
            <MyFile accessToken={accessToken}/>
          </Route>
        </Switch>
      </Router>
      
    </div>
  );
}

export default App;


