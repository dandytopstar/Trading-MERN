const RoundService = require("../service/round");
const CryptoService = require("../service/crypto");
const config = require("../config");

const getCurrentRound = async (req, res) => {
	const post = await RoundService.getCurrentRound();
  const eth = await CryptoService.getCryptoBy({symbol: config.CryptoConfig[0].symbol});
  if(post)
    return res.send({status: true, data: {round: post, ethPrice: eth.price}});
  return res.send({status: false, message: "No round started yet!"})
}


module.exports = {
  getCurrentRound
}