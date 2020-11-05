import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import {useHistory} from "react-router-dom";

function Login({isLoggedIn, setIsLoggedIn}){

	const history = useHistory();
	var username = '';
	var password = '';

	if(isLoggedIn) history.push('/');

	function logIn() {
		var token = '';
		try{
			axios.post("http://localhost:8000/login",
				{payload: {username: username, password: password}})
			.then(res => {
				//console.log(res);
				if(res.data === "Incorrect username or password"){
					alert(res.data);
					return;
				}
				const cookie = new Cookies();
				cookie.set('userToken', res.data.token);
				setIsLoggedIn(true);
				history.push('/');
			});
		}
		catch (error){
			console.log(error.response);
		}
		
	}

	return(
		<div className="login-container">
				<div>
					<label htmlFor="username">Username</label>
					<input type="text" placeholder="Enter Username" pattern="[A-Za-z0-9_]{3,15}" name="username" required
						onChange={(e) => username = e.target.value}/>
				</div>
				
				<div>
					<label htmlFor="password">Password</label>
					<input type="password" placeholder="Enter Password" pattern="[A-Za-z0-9_]{3,15}" name="password" required
						onChange={(e) => password = e.target.value}/>
				</div>
				
				<button onClick={() => logIn()}>Login</button>
		</div>
	);
}

export default Login;