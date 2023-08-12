import React, {useState, useContext, useEffect} from "react";
import { AdvancedChart, TickerTape } from "react-tradingview-embed";
import Header from "../../components/header";
import OrderHistory from "../../components/orderHistory";
import OrderMarket from "../../components/orderMarket";
import RoundInfo from "../../components/roundInfo";
import './index.css';


const Home = (props) => {
  return (
     <div
        className="App"
        style={{background: "rgba(0, 0, 0, 0.85)"}}>
          <div className="">
            <Header/>
            <TickerTape widgetProps={{
                    showSymbolLogo: true,
                    isTransparent: true,
                    displayMode: "adaptive",
                    colorTheme: "dark",
                    autosize: true,
                    symbols: [
                      {
                        proName: "BITSTAMP:ETHUSD",
                        title: "ETH/USD"
                      },
                      {
                        proName: "BITSTAMP:BTCUSD",
                        title: "BTC/USD"
                      },
                      {
                        proName: "BINANCE:BNBUSDT",
                        title: "BNB/USDT"
                      },
                      {
                        proName: "BINANCE:ADAUSD",
                        title: "ADA/USD"
                      },
                      {
                        proName: "BINANCE:DOTUSDT",
                        title: "DOT/USDT"
                      },
                      {
                        proName: "UNISWAP:UNIUSDT",
                        title: "UNI/USDT"
                      }
                    ]
                  }}/>

            <div className="order_section" >
              <div className="tradingview_chart">
                <AdvancedChart widgetProps={{ 
                  interval: "1D",
                  colorTheme: "dark",
                  symbol: "ETHUSD",
                  }} />
              </div>
            <div>
              <RoundInfo />
              <OrderMarket />

            </div>
            </div>
          </div>
     	

      <OrderHistory />

    </div>
  );
}

export default Home;
