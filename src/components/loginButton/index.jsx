import {useState, useContext, useEffect} from "react";
import { DiscordLoginButton, TwitterLoginButton, createButton } from "react-social-login-buttons";
import {UserContext} from "../../provider/user";
import Modal from "../modal";

import './index.css';

const config = {
	text: "Connect",
	icon: "Ethereum",
	iconFormat: name => `fa fa-Ethereum`,
	style: { background: "#3b5998" },
	activeStyle: { background: "#293e69" }
  };
  const MyEthereumLoginButton = createButton(config);

const LoginButton = () => {
	const user = useContext(UserContext);
	const [signUpModalShow, setSignUpModalShow] = useState(false);
	const [logInModalShow, setLogInModalShow] = useState(false);

  return (
	<>
		<button onClick = {
			user.userInfo.islogin?
				user.logout
			:
			()=>{
				setLogInModalShow(true);
			}}>
			{
			user.userInfo.islogin?
				"log out"
			:
				"log in"
			}
		</button>
		
		<Modal visible={signUpModalShow} close={() => setSignUpModalShow(false)} title="Sign Up">
			<div className="flex-between border p4 m8">
				wallet: {user.userInfo.walletAddress}
			</div>
			<div className="flex-between">
				<DiscordLoginButton onClick={() => user.authWithDiscord()}>
					<span>Connect</span>
				</DiscordLoginButton>
			</div>
			<div className="flex-between">
				<TwitterLoginButton onClick={() => user.authWithTwitter()}>
					<span>Connect</span>
				</TwitterLoginButton>
			</div>
			
		</Modal>


		<Modal visible={logInModalShow} close={() => setLogInModalShow(false)} title="Log In">
			<div className="flex-between">
				<MyEthereumLoginButton onClick={async () =>{
					localStorage.removeItem("id");
					localStorage.removeItem("jwt_token");
					setLogInModalShow(false)
					let wallet = await user.connectWallet();
					if(wallet){
						setSignUpModalShow(true);
					}
				}}>
					<span>Login with Wallet</span>
				</MyEthereumLoginButton>
			</div>
			<div className="flex-between">
				<DiscordLoginButton onClick={() => {
					localStorage.removeItem("id");
					localStorage.removeItem("jwt_token");
					user.authWithDiscord();
				}}>
					<span>Login with Discord</span>
				</DiscordLoginButton>
			</div>
			<div className="flex-between">
				<TwitterLoginButton onClick={() => {
					localStorage.removeItem("id");
					localStorage.removeItem("jwt_token");
					user.authWithTwitter();
				}}>
					<span>Login with Twitter</span>
				</TwitterLoginButton>
			</div>
	
		</Modal>
    </>
  );
}

export default LoginButton;
