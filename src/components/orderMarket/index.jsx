import React, {useState} from "react";
import BuySell from "../../components/buysell";
import Market from "../../components/market";
import './index.css';


const OrderMarket = (props) => {
  const [mode, setMode] = useState(0);
 
  return (
        <div>
        <p className="text-center"> <a className={mode == 0 ? "order_market_tab_clicked" : "order_market_tab"} onClick={()=>setMode(0)}>Limit Order</a> <a className={mode == 1 ? "order_market_tab_clicked" : "order_market_tab"} onClick={()=>setMode(1)}>Market</a></p>
          {
            mode == 1 && 
            <Market />
          }
          {
            mode == 0 &&
            <BuySell />
          }
          
        </div>
  );
}

export default OrderMarket;
