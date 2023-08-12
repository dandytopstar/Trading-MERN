import {useState, useContext} from "react";
import {UserContext} from "../../provider/user";
import {OrderContext} from "../../provider/order";
import LoginButton from "../loginButton";

import './index.css';


const BuySell = () => {

    const user = useContext(UserContext);
    const order = useContext(OrderContext);
    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);

    const sellFunction = () => {
        if(user.userInfo.eth < amount){
            user.walletConnect
            return;
        }
        order.makeOrder({
            orderType: "sell",
            amount: amount,
            price: price
        })
        setAmount(0);
        setPrice(0);
    }

    const buyFunction = () => {
        if(user.userInfo.usd < amount * price){
           alert("You dont have enough USD!");
           return;
        }

        order.makeOrder({
            orderType: "buy",
            amount: amount,
            price: price
        })
        setAmount(0);
        setPrice(0);
    }
    return (
        <div className="buy-sell">
            <div className="flex-between">
                <span>Amount(ETH): </span><input type="number"  value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="flex-between">
                <span>Price($): </span><input type="number" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
            <div className="flex-between">
                <span>total(ETH): </span><input readOnly={true} type="number" value={price * amount} />
            </div>

            {
                user.userInfo.islogin?
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

export default BuySell;
