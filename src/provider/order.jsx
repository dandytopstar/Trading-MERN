import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import {SERVER_URL} from "../constants/env";
import setAuthToken from '../utils/setAuthToken';
import {UserContext} from "./user";
import socketIOClient from "socket.io-client";


const OrderContextTemplate = {
	myOrders:[{

	}],
	ethPrice: 1,
	roundInfo: null,
	getRoundInfo: () => {},
	getMyOrders: () => {},
	makeOrder: () => {},
	cancelOrder: () => {},
	makeMarket: () => {}
};

const OrderContext = React.createContext(OrderContextTemplate);

const OrderProvider = ({children}) => {

	const [myOrders, setMyOrders] = useState([]);
	const [ethPrice, setETHPrice] = useState(1);
	const [roundInfo, setRoundInfo] = useState(null);

	const user = useContext(UserContext);
	const mySocket = socketIOClient(SERVER_URL);

	mySocket.on("updatePrice", async function(response){
		console.log(response);
		setETHPrice(parseFloat(response));
	})

	mySocket.on("updateRound", async function(response){
		console.log(response);
		setRoundInfo(response);
	})

	useEffect(()=>{
		if(user.userInfo.islogin){
			// if(myOrders.length ==0){
				
			// }
			mySocket.emit("addUser", localStorage.getItem("id"));
			getMyOrders();
				mySocket.on("order", (data)=>{
					console.log("event listner")
					user.getMyInfo();
					getMyOrders();
				})
		}

	},[user.userInfo.islogin])
	const getMyOrders = async () => {
		const userId = localStorage.getItem("id");
		axios.get(`${SERVER_URL}api/orders/userid/${userId}`).then(result=>{
			if(result.data.status && result.data.data){
				setMyOrders(result.data.data);
			}
		})
	}

	const makeOrder = async (payload) => {
		const userId = localStorage.getItem("id");
		setAuthToken(localStorage.getItem("jwt_token"));
		axios.post(SERVER_URL + "api/order/makeorder", {userId : userId, ...payload}).then((result) => {
			if(result.data.status){
				setMyOrders(result.data.orderHistory)
				user.setUserInfo(prev => ({
					...prev,
					eth: result.data.data.eth_balance,
					usd: result.data.data.usd_balance,
					eth_holding: result.data.data.eth_holding,
					usd_holding: result.data.data.usd_holding,
				}))
			}	
			else{
				alert(result.data.message);
			}	
		})
	}

	const cancelOrder = async (orderId) => {

		setAuthToken(localStorage.getItem("jwt_token"));
		axios.post(SERVER_URL + "api/order/cancelorder", {id : orderId}).then((result) => {
			if(result.data.status){
				setMyOrders(result.data.orderHistory)
				user.setUserInfo(prev => ({
					...prev,
					eth: result.data.data.eth_balance,
					usd: result.data.data.usd_balance,
					eth_holding: result.data.data.eth_holding,
					usd_holding: result.data.data.usd_holding,
				}))
			}	
		})
	}

	const makeMarket = async (payload) => {
		const userId = localStorage.getItem("id");
		setAuthToken(localStorage.getItem("jwt_token"));
		axios.post(SERVER_URL + "api/order/makemarket", {userId : userId, ...payload}).then((result) => {
			if(result.data.status){
				setMyOrders(result.data.orderHistory)
				user.setUserInfo(prev => ({
					...prev,
					eth: result.data.data.eth_balance,
					usd: result.data.data.usd_balance,
					eth_holding: result.data.data.eth_holding,
					usd_holding: result.data.data.usd_holding,
				}))
			}
			else{
				alert(result.data.message);
			}	
		})
	}

	const getRoundInfo = async () => {
		axios.get(`${SERVER_URL}api/currentround`).then(result=>{
			if(result.data.status){
				setRoundInfo(result.data.data.round);
				setETHPrice(result.data.data.ethPrice);
			}
		})
	}


return(
	<OrderContext.Provider
		value={{
			ethPrice,
			myOrders,
			roundInfo,
			getRoundInfo,
			makeOrder,
			cancelOrder,
			makeMarket,
			getMyOrders
		}}
	>
		{children}
	</OrderContext.Provider>
);

}


export {OrderContext};
export default OrderProvider;
