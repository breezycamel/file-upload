import React from 'react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import {useHistory } from "react-router-dom";
function NavBar({isLoggedIn}){
	const history = useHistory();
	return(
		<div className="nav-bar">
			<ul>
				<li><a onClick={() => history.push("/public")}>Public</a></li>
				<li><a onClick={() => history.push("/sharedfile")}>Shared File</a></li>
				<li><a onClick={() => history.push("/myfile")}>My File</a></li>
				{(!isLoggedIn)?<li><LoginButton/></li> : <li><LogoutButton/></li> }
			</ul>
		</div>
	);
}

export default NavBar;