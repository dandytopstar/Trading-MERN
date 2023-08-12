import {useState, useContext, useEffect, useCallback, useMemo} from "react";
import {LeaderboardContext} from "../../provider/leaderboard";
import {OrderContext} from "../../provider/order";
import WeekResult from "../weekResult";
import TopWinner from "../topWinner";
import './index.css';


const Termresult = () => {
  const leaderboard = useContext(LeaderboardContext);
  const order = useContext(OrderContext);

  useEffect(()=>{
    leaderboard.getWeekResult();
  },[])

  const lastWeekResult = useCallback(()=>{
    let result = [];

    leaderboard.lastWeekResult.map(el => result.push({
      userName: el.owner_id.walletAddress,
      oldAmount: el.old_amount,
      currentAmount: el.current_amount,
      lostAmount: el.lost_amount,
      is_winner: el.owner_id.is_winner
    }))
    console.log (result)
    result.sort(function(a,b){return (a.oldAmount - a.currentAmount) - (b.oldAmount - b.currentAmount)});
    result.reverse();
    console.log (result)

    return result;
  },[leaderboard.lastWeekResult])

  const currentWeekResult = useCallback(()=>{
    let result = [];

    leaderboard.currentWeekResult.map(el => {
      const currentAmount = el.owner_id.usd_balance + el.owner_id.usd_holding + el.owner_id.eth_balance * order.ethPrice + el.owner_id.eth_holding * order.ethPrice;
      // console.log(`${el.owner_id.usd_balance}_${el.owner_id.usd_holding}_${el.owner_id.eth_balance}_${el.owner_id.eth_holding}_${order.ethPrice}`)
      result.push({
        userName: el.owner_id.walletAddress,
        oldAmount: el.old_amount,
        currentAmount: currentAmount,
        lostAmount: el.old_amount - currentAmount
      })
    })

    result.sort(function(a,b){return parseFloat(a.lostAmount) - parseFloat(b.lostAmount)});
    result.reverse();
    return result;
  },[leaderboard.currentWeekResult, order.ethPrice])

  return (
    <div>
     <div className="termresult-content">
        <div style={{width: "50%"}}>
           <WeekResult title="Previous Week" result={lastWeekResult()} />
        </div>
        <div style={{width: "50%"}}>
           <WeekResult title="Current Week" result={currentWeekResult()} />
        </div>

       
    </div>
     <div className="">
      <TopWinner title="Top All-Time Winners" result={leaderboard.topResult} />  
      </div>
    </div>
   
  );
}

export default Termresult;
