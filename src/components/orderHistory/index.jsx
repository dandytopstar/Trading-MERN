import {useState, useContext, useEffect} from "react";
import {OrderContext} from "../../provider/order";

import './index.css';


const OrderHistory = () => {

  const [tab, setTab] =  useState({mode: 0, content: "executed, canceled, pending"});
  const order = useContext(OrderContext);

  useEffect(()=>{
    
  },[])
  return (
    <div className="order_history">
      <ul >
        <li style={{display: "inline"}} className = {`p4 ${tab.mode == 0 ? "tab-selected" : "tab"}`} onClick = {() => setTab({mode: 0, content: "executed, canceled, pending"})}>All</li>
        <li style={{display: "inline"}} className = {`p4 ${tab.mode == 1 ? "tab-selected" : "tab"}`} onClick = {() => setTab({mode: 1, content: "executed"})}>Executed</li>
        <li style={{display: "inline"}} className = {`p4 ${tab.mode == 2 ? "tab-selected" : "tab"}`} onClick = {() => setTab({mode: 2, content: "pending"})}>Pending</li>
        <li style={{display: "inline"}} className = {`p4 ${tab.mode == 3 ? "tab-selected" : "tab"}`} onClick = {() => setTab({mode: 3, content: "canceled"})}>Canceled</li>
      </ul>
        <div className="table_header">
            <span className="p4" style={{width: "10%"}}>No</span>
            <span className="p4" style={{width: "10%"}}>Order Mode</span>
            <span className="p4" style={{width: "10%"}}>Order Type</span>
            <span className="p4" style={{width: "10%"}}>Amount</span>
            <span className="p4" style={{width: "10%"}}>Price</span>
            <span className="p4" style={{width: "10%"}}>total</span>
            <span className="p4" style={{width: "20%"}}>created</span>
            <span className="p4" style={{width: "10%"}}>status</span>
            <span className="p4" style={{width: "10%"}}>action</span>

        </div>
        { order.myOrders &&
          order.myOrders.map((el, idx) => {
            if(tab.content.includes(el.status))
              return(
              <div className="table_body" key={idx}>
                  <span className="p4" style={{width: "10%"}}>{idx + 1}</span>
                  <span className="p4" style={{width: "10%"}}>{el.order_mode}</span>
                  <span className="p4" style={{width: "10%"}}>{el.order_type}</span>
                  <span className="p4" style={{width: "10%"}}>{el.amount.toFixed(2)}</span>
                  <span className="p4" style={{width: "10%"}}>{el.price.toFixed(2)}</span>
                  <span className="p4" style={{width: "10%"}}>{(parseFloat(el.price) * parseFloat(el.amount)).toFixed(2)}</span>
                  <span className="p4" style={{width: "20%"}}>{el.created}</span>
                  <span className="p4" style={{width: "10%"}}>{el.status}</span>
                  <button onClick={()=>order.cancelOrder(el._id)} disabled={el.status == "pending"?false:true} style={{width: "10%"}}>Cancel</button>

              </div>
              )
             
          })
        }
    </div>
  );
}

export default OrderHistory;
