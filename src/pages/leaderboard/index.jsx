import React, {useState, useContext, useEffect} from "react";
import Header from "../../components/header";
import Termresult from "../../components/termresult";
import './index.css';


const LeaderBoard = (props) => {
 
  return (
     <div
        className="App"
        >
          <div className="full-content">
            <Header />
            <div style={{height: "20px"}}></div>
            <Termresult />
          </div>

    </div>
  );
}

export default LeaderBoard;
