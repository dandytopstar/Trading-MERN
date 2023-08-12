import {useState, useContext, useEffect} from "react";
import {UserContext} from "../../provider/user";
import {OrderContext} from "../../provider/order";
import LoginButton from "../loginButton";


import './index.css';


const Market = () => {

    const user = useContext(UserContext);
    const order = useContext(OrderContext);
    const [usd, setUSD] = useState(0);
    const [eth, setETH] = useState(0);
    
    useEffect(()=>{
        setUSD(eth * order.ethPrice)
    },[order.ethPrice])
    const sellFunction = () => {
        if(user.userInfo.eth < eth){
            alert("You dont have enough ETH!");
            return;
        }
        order.makeMarket({
            orderType: "sell",
            amount: eth,
            price: order.ethPrice
        })
    }

    const buyFunction = () => {
        if(user.userInfo.usd < usd){
           alert("You dont have enough USD!");
           return;
        }

        order.makeMarket({
            orderType: "buy",
            amount: eth,
            price: order.ethPrice
        })
    }
    return (
        <div className="buy-sell">
            <div className="flex-between">
                <span>Amount(ETH): </span><input type="number"  value={eth} onChange={e => {
                    setETH(e.target.value);
                    setUSD(e.target.value * order.ethPrice);
                    }} />
            </div>
            <div className="flex-between">
                <span>Amount(USD): </span><input type="number" value={usd} onChange={e => {
                    setUSD(e.target.value);
                    setETH(e.target.value / order.ethPrice);

                    }} />
            </div>
          {
            user.userInfo.islogin ? 
            <div className="flex-between">
                <button onClick={buyFunction}>Buy</button>
                <button onClick={sellFunction}>Sell</button>
            </div>
            :
            <LoginButton />
          }
            
        </div>
    );
}

export default Market;
