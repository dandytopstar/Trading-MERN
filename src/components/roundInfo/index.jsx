import {useState, useContext, useEffect, useCallback} from "react";
import {OrderContext} from "../../provider/order";
import {UserContext} from "../../provider/user";

import './index.css';

let timer;

const RoundInfo = () => {

  const [lastSeconds, setLastSeconds] = useState(0);
  const order = useContext(OrderContext);
  const user = useContext(UserContext);
  useEffect(()=>{
    order.getRoundInfo();
  },[])
  
  useEffect(()=>{
    if(!order.roundInfo)
      return;
    clearInterval(timer);
    timer = setInterval(()=>{
        const timeline = new Date(order.roundInfo.created);
        timeline.setSeconds(timeline.getSeconds() + order.roundInfo.duration);
        let difftime = parseInt((timeline.getTime() - Date.now())/1000);
        const day = parseInt(difftime/(3600 * 24 ));
        difftime = difftime%(3600 * 24 );
        const hour = parseInt(difftime/3600);
        difftime = difftime%3600;
        const min = parseInt(difftime/60);
        difftime = difftime%60;
        const sec = difftime;

        setLastSeconds(`${day}days ${hour}hours ${min}mins ${sec}seconds`);
    }, 1000)

    return(function clean(){
      clearInterval(timer);
    })
  },[order.roundInfo])

  return (
      <div className="p4">
        <p>The week timer: {order.roundInfo?`${lastSeconds}` : "calculating..."}</p>
        <p>Total Balance($): {user.userInfo.islogin? (user.userInfo.usd + user.userInfo.usd_holding + user.userInfo.eth * order.ethPrice + user.userInfo.eth_holding * order.ethPrice).toFixed(2) : 0}</p>
      </div>
  );
}

export default RoundInfo;
