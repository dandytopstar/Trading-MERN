const Round = require("../models/round");


const getAllRounds = async () => {
	const posts = await Round.find();
  return posts;
}


const getCurrentRound = async () => {
	 try {
      const post = await Round.findOne({ status: "pending" });
      return post;
    } catch {
      return null;
    }
}

const getRoundsBy = async (payload) => {
  try {
    const post = await Round.find(payload);
    return post;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getRoundBy = async (payload, sort1 = {}, sort2 = {}) => {
  try {
    const post = await Round.findOne(payload, sort1, sort2);
    return post;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const updateRound = async (id, payload) => {
  try{
    await Round.updateOne({_id: id}, payload);
    return Round.findOne({_id: id});
  }catch(error){
    console.log(error)
    return null;
  }
}

const makeRound = async (payload) => {
  try {
    const oldRounds = await Round.find({status: "pending"});
    
    if(oldRounds){
      oldRounds.map(el => {
        el.status = "end";
        el.save();
      })
    }
    const round = new Round(payload)
    await round.save();
    return round;
  } catch {
    return null;
  }
}


module.exports = {
  getRoundBy,
  getRoundsBy,
  getAllRounds,
  getCurrentRound,
  updateRound,
  makeRound
}