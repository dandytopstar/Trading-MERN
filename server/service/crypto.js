const Crypto = require("../models/crypto");



const getCryptoBy = async (payload) => {
	 try {
      const post = await Crypto.findOne(payload);
      return post;
    } catch {
      return null;
    }
}

const addCrypto = async (payload) => {
  try{
    if(!payload.name || !payload.symbol)
      return null;

    const post = new Crypto(payload)
    await post.save();
    return post;
  }catch(error){
    console.log(error)
    return null;
  }
}

const updateCrypto = async (symbol, payload) => {
  try{
    await Crypto.updateOne({symbol}, {...payload, updated: Date.now()});
    return Crypto.findOne({symbol});
  }catch(error){
    console.log(error)
    return null;
  }
}

const deleteCrypto = async (symbol) => {
  try{
    const post = await Crypto.findOne({symbol});
    post.deleted = true;
    await post.save();
    return post;
  }catch(error){
    console.log(error)
    return null;
  }
}


module.exports = {
  getCryptoBy,
  addCrypto,
  updateCrypto,
  deleteCrypto,
}