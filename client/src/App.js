import React, {useState,useEffect} from 'react';
import axios from 'axios';
import './App.css';
import Login from './components/Login';
import NavBar from './components/NavBar.js';
import { useAuth0 } from "@auth0/auth0-react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

function App() {
  const { user, isAuthenticated, isLoading } =  useAuth0();

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
        </Switch>
      </Router>
      
    </div>
  );
}

export default App;


