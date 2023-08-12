const TermresultService = require("../service/termresult");
const RoundService = require("../service/round");

const getLastWeekResult = async (req, res) => {
  const lastWeekRound = await RoundService.getRoundBy({status: "end"},{}, {sort : {'created': -1}});
  if(!lastWeekRound)
    return res.send({status: false, message: "no round for last week "});
	const lastWeekResults = await TermresultService.getTermresultsBy({round_id: lastWeekRound._id});
  if(!lastWeekResults)
    return res.send({status: false, message: "no round result for last week"});

  return res.send({status: true, data: lastWeekResults});
}

const getCurrentWeekResult = async (req, res) => {
  const currentWeekRound = await RoundService.getRoundBy({status: "pending"},{}, {sort : {'created': -1}});
  if(!currentWeekRound)
    return res.send({status: false, message: "no round for this week "});
	const currentWeekResults = await TermresultService.getTermresultsBy({round_id: currentWeekRound._id});
  if(!currentWeekResults)
    return res.send({status: false, message: "no round result for last week"});

  return res.send({status: true, data: currentWeekResults});
}

const getTopResult = async (req, res) => {
  const winners = [];
  const allRounds = await RoundService.getAllRounds();
  if(allRounds.length <= 0)
    return res.send({status: false, message: "No round started yet"});
  allRounds.map(el => {
    if(el.winners.length > 0)
      winners.push(...el.winners)
  })
  winners.sort(function(a, b) {return (b.lost_amount - a.lost_amount)});

  return res.send({status: true, data:winners});
}




module.exports = {
  getLastWeekResult,
  getCurrentWeekResult,
  getTopResult
}