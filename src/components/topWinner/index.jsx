import {useState, useContext, useEffect} from "react";
import truncateWallet from "../../utils/truncateWallet";
import './index.css';


const TopWinner = (props) => {

  // useEffect(()=>{
  //   console.log(props.result)
  // },[props])
  const rateLostRaise = (prev, current) => {
    const rate = (prev - current) / prev * 100;
    if(rate > 0)
      return `+${rate.toFixed(2)}%`;
    if(rate < 0)
      return `-${rate.toFixed(2)}%`;
    if(rate == 0)
      return "0.00%";
  }

  return (
      <div className="p4" style={{width: "500px"}}>
        <p>{props.title || "Top result"}</p>
        <div className="table_header">
          <span className="p4" style={{width: "20%"}}>Rank</span>
          <span className="p4" style={{width: "40%"}}>User</span>
          <span className="p4" style={{width: "40%"}}>Lost/Gained Amount</span>
        </div>
        {
          props.result.length > 0 && 
          props.result.map((el, idx) => (
            <div className={`table_body "winner-color" : ""}`} key={idx}>
              <span className="p4" style={{width: "20%"}}>{idx + 1}</span>
              <span className="p4" style={{width: "40%"}}>{truncateWallet(el.user_wallet)}</span>
              <span className="p4" style={{width: "40%"}}>{`${parseFloat(el.lost_amount).toFixed(2)} ${rateLostRaise(el.old_amount, el.current_amount)}`}</span>
            </div>
          ))
        }
        <div>

        </div>
          
      </div>
  );
}

export default TopWinner;
