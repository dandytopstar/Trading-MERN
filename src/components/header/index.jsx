import {useState, useContext, useEffect} from "react";
import {Link} from "react-router-dom";
import {UserContext} from "../../provider/user";
import LoginButton from "../loginButton";
import './index.css';

const Header = () => {
	const user = useContext(UserContext);

  return (
	<div>
		<div className="logo">
			<div style={{width: "30%"}}>
				<Link to="/">Home</Link>
				<Link to="/leaderboard">LeaderBoard</Link>
				<Link to="/profile">Profile</Link>
			</div>
			<div style={{flexGrow: 1}}>ETH_Trading_Simulator</div>
			<div style={{width: "30%"}}>
				<LoginButton />
			</div>
		</div>
		

		{
			user.userInfo.islogin &&
			<>ETH: <input type="text" value={user.userInfo.eth.toFixed(2)} readOnly={true}/></>
		}
		{
			user.userInfo.islogin &&
			<>USD: <input type="text" value={user.userInfo.usd.toFixed(2)} readOnly={true}/></>
		}

    </div>
  );
}

export default Header;
