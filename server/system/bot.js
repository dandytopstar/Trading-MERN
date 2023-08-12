const TradingViewAPI = require("tradingview-scraper");
const OrderService = require("../service/order");
const RoundService = require("../service/round");
const CryptoService = require("../service/crypto");
const TermresultService = require("../service/termresult");
const UserService = require("../service/user");
const SettingService = require("../service/setting");
const NotificationService = require("../service/notification");
const config = require("../config");
const mathFuns = require("../helpers/math");
const round = require("../models/round");

const tv = new TradingViewAPI.TradingViewAPI();
let eth_price_current = 0;
let eth_price_old = 0;
let init = false;

const updatePrice = (io, sockets) => {
    

    tv.setup().then(() => {
        tv.getTicker(config.trading_symbol).then(ticker => {
        ticker.on('update', data => {
            if (data.lp && data.lp != eth_price_current) {
                if(!init){
                    eth_price_old = data.lp;
                    eth_price_current = data.lp;
                    init = true;
                } else {
                    eth_price_old = eth_price_current;
                    eth_price_current = data.lp;
                    console.log(eth_price_current)
                    updateEthPrice(eth_price_current);
                    
                    io.emit("updatePrice", eth_price_current);
                    orderCheckBot(io);
                }
                
            }
        });
        })
    }).catch(error => console.log(error));
  }

  const updateEthPrice = async (newPrice) => {
    const ethDetail = await CryptoService.getCryptoBy({symbol: config.CryptoConfig[0].symbol});
    if(!ethDetail)
        CryptoService.addCrypto({name: config.CryptoConfig[0].name, symbol: config.CryptoConfig[0].symbol, price: newPrice});
    else
        CryptoService.updateCrypto(config.CryptoConfig[0].symbol, {price: eth_price_current});
  }

  const orderCheckBot = async (io) => {
    try {
        if(!init)
            return;
        let {min, max} = mathFuns.sortTwoNums(eth_price_current, eth_price_old);
        const pendingEligibleOrders = await OrderService.getOrderBy({status: "pending", order_mode: "limit", price: {$gte: min, $lte: max}});
        pendingEligibleOrders.map(async (el) => {
            if(el.order_type == "buy"){
                await OrderService.confirmOrder(el._id);
                let userDetail = await UserService.updateUser(el.order_owner, {$inc: {eth_balance: +el.amount, usd_holding: -(el.amount * el.price)}})
                if(userDetail.socket_id)
                    io.to(userDetail.socket_id).emit("order", "order updated!");
            }
            if(el.order_type == "sell"){
                await OrderService.confirmOrder(el._id);
                let userDetail = await UserService.updateUser(el.order_owner, {$inc: {usd_balance: +(el.amount * el.price), eth_holding: -el.amount}})
                if(userDetail.socket_id)
                    io.to(userDetail.socket_id).emit("order", "order updated!");
            }
        })
    } catch (error) {
        console.log(error);
    }

}

const roundCheckBot = async (io) => {
    try {
        const lastRound = await RoundService.getCurrentRound();
        const currentRound = await RoundService.makeRound({duration: 3600 * 1, created: Date.now()});
        io.emit("updateRound", currentRound);

        if(!lastRound)
            return;


        const allUsers = await UserService.getUsersBy({is_winner: false, signed: true});
        let roundResult = [];
        for(let i=0; i< allUsers.length; i++){
            const nowAmount = allUsers[i].usd_balance + allUsers[i].usd_holding + allUsers[i].eth_balance * eth_price_current + allUsers[i].eth_holding * eth_price_current;
            let termresult = await TermresultService.getTermresultBy({
                round_id: lastRound._id, owner_id: allUsers[i]._id, status: "pending"
            });
            if(termresult){
                TermresultService.updateTermresult(
                    {
                        _id: termresult._id
                    }, {
                        current_amount: nowAmount,
                        lost_amount: termresult.old_amount - nowAmount,
                        status: "ended"
                });
                
                roundResult.push({
                    user_id: allUsers[i]._id,
                    result_id: termresult._id,
                    user_wallet: allUsers[i].walletAddress,
                    old_amount: termresult.old_amount,
                    current_amount: nowAmount,
                    lost_amount: termresult.old_amount - nowAmount
                })
                
            }
        }

       /////////////////check winners///////////////////////
        if(roundResult.length <= 0)
            return;

        const {roundDuration, winnerAmount} = await SettingService.getSettingInfo();
        roundResult.sort(function(a,b){return a.lost_amount - b.lost_amount});
        roundResult.reverse();
        console.log(roundResult);
        RoundService.updateRound(lastRound._id, {winners: roundResult.slice(0, winnerAmount)});
        for(let i =0; i< winnerAmount; i++){
            if(roundResult[i]){
                await UserService.updateUser(roundResult[i].user_id, { is_winner: true});
                NotificationService.addNotification({owner_id: roundResult[i].user_id, message: `Congratulation Winner! You are ${i + 1}th Winner in this week`})
            }   
        }

        ///////////////make new termresults////////////////////
        const loosers = await UserService.getUsersBy({is_winner: false, signed: true});
        loosers.map((el) => {
            const currentLooserMark = el.usd_balance + el.usd_holding + el.eth_balance * eth_price_current + el.eth_holding * eth_price_current;
            TermresultService.makeTermresult({
                round_id: currentRound._id,
                owner_id: el._id,
                old_amount: currentLooserMark,
                current_amount: currentLooserMark,
            })
        })
        
    } catch (error) {
        console.log(error);
    }
}

// const checkWinners = async (roundDetail) => {
//     if(!roundDetail)
//         return;
//     const termResultsByUser = await TermresultService.getTermresultsBy({round_id: roundDetail._id});
//     console.log(termResultsByUser);
//     if(termResultsByUser.length <= 0)
//         return;
//     const {roundDuration, winnerAmount} = await SettingService.getSettingInfo();
//     const winners = await termResultsByUser.map((el, idx) => {
//         if(idx < winnerAmount)
//             return el._id;
//     });
//     await RoundService.updateRound(roundDetail._id, {winners});
//     winners.map((el, idx) => {
//         const userID = termResultsByUser[idx].owner_id;
//         UserService.updateUser(userID, {
//             is_winner: true
//         })
//         NotificationService.addNotification({owner_id: userID, message: `Congratulation Winner! You are ${idx + 1}th Winner in this week`})
//     })
// }
module.exports = {
    updatePrice,
    orderCheckBot,
    roundCheckBot
}