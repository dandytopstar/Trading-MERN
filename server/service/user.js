const User = require("../models/user");
const randoms = require("../helpers/randoms");

const getAllUsers = async () => {
	const posts = await User.find();
    return posts;
}

const getUserById = async (userID) => {
	 try {
      const post = await User.findOne({ _id: userID });
      return post;
    } catch(error) {
      console.log(error);
      return null;
    }
}

const getUserBy = async (payload) => {
  try {
    const post = await User.findOne(payload);
    return post;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getUsersBy = async (payload) => {
  try {
    const post = await User.find(payload);
    return post;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getUserByWallet = async (walletAddress) => {
  try {
     const post = await User.findOne({ walletAddress: walletAddress });
     return post;
   } catch(error) {
     console.log(error);
     return null;
   }
}

const addUser = async (payload) => {
    try{
      if(!payload.walletAddress)
        return null;

      const post = new User({
        walletAddress: payload.walletAddress,
        twitter: payload.twitter,
        discord: payload.discord,
        userName: randoms.getUserName(6),
        userAvatar: "default.jpg",
        jwt_token: payload.token
      })
      await post.save();
      return post;
    }catch(error){
      console.log(error)
      return null;
    }
}

const updateUser = async (userID, payload, files = null) => {
  try {
    if(files){
      
      let myFile = files.file;
      let tempNum = randoms.randomNumber(6);
      let image_name = tempNum + ".jpg";
      
      myFile.mv('./public/useravatar/'+image_name, async function (uploadErr) {});

      await User.updateOne({_id: userID}, {...payload, updated: Date.now(), userAvatar: image_name});
      return User.findOne({_id: userID});
    }
    else{
      await User.updateOne({_id: userID}, {...payload, updated: Date.now()});
      return User.findOne({_id: userID});
    }
  } catch (error) {
    console.log(error);
    return null;
  }
  

}

const deleteUser = async (userId) => {
	try {
      const post = await User.findOne({ _id: userId });
      post.deleted = true;
      await post.save();
      return post;
      // res.status(204).send();
    } catch(error) {
      console.log(error);
      return null;
    }
}


module.exports = {
	getAllUsers,
	getUserByWallet,
  getUserBy,
  getUsersBy,
	getUserById,
  addUser,
	updateUser,
	deleteUser
}