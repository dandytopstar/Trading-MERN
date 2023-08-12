import React, { useState, useEffect } from "react";
import axios from "axios";
import {SERVER_URL} from "../constants/env";


const LeaderboardContextTemplate = {
	lastWeekResult:[{

	}],
	currentWeekResult:[{

	}],
	topResult: [{}],
	getWeekResult: () => {},
	getRoundInfo: () => {}
};

const LeaderboardContext = React.createContext(LeaderboardContextTemplate);

const LeaderboardProvider = ({children}) => {

	const [lastWeekResult, setLastWeekResult] = useState([]);
	const [currentWeekResult, setCurrentWeekResult] = useState([]);
	const [topResult, setTopResult] = useState([]);

	const getWeekResult = async () => {

		axios.get(`${SERVER_URL}api/roundresult/current`).then(result=>{
			if(result.data.status){
				setCurrentWeekResult(result.data.data);
			}
		})

		axios.get(`${SERVER_URL}api/roundresult/last`).then(result=>{
			if(result.data.status){
				setLastWeekResult(result.data.data);
			}
		})

		axios.get(`${SERVER_URL}api/roundresult/top`).then(result=>{
			if(result.data.status){
				setTopResult(result.data.data);
			}
		})
	}

	


return(
	<LeaderboardContext.Provider
		value={{
			topResult,
			lastWeekResult,
			currentWeekResult,
			getWeekResult
		}}
	>
		{children}
	</LeaderboardContext.Provider>
);

}


export {LeaderboardContext};
export default LeaderboardProvider;
