var jwt = require('jsonwebtoken');
var { TwitterApi } = require("twitter-api-v2") ;
const DiscordOauth2 = require("discord-oauth2");
const UserService = require("../service/user");
const OrderService = require("../service/order");
const TermresultService = require("../service/termresult");
const RoundService = require("../service/round");
const NotificationService = require("../service/notification");
const config = require("../config");

const oauth = new DiscordOauth2();

const client = new TwitterApi({ 
  clientId: config.Twitter_CLIENT_ID, 
  clientSecret: config.Twitter_CLIENT_SECRET 
});


const getAllUsers = async (req, res) => {
	const posts = await UserService.getAllUsers();
    return res.send({status: true, data: posts});
}
const loginWithWallet = async (req, res) => {
  const userDetail = await UserService.getUserByWallet(req.body.walletAddress);

  if(!userDetail){
    let post = await UserService.addUser({walletAddress: req.body.walletAddress});
    return res.send({status: true, data: post});
  }

  if(!userDetail.signed){
    return res.send({status: true, data: userDetail});
  }
  else{
    var token = jwt.sign({ data: req.body.walletAddress }, config.jwt_secret, { expiresIn: config.jwt_expire });
    console.log("jtoken", token);
    let post = await UserService.updateUser(userDetail._id, {jwt_token : token});
    let notifications = await NotificationService.getNotificationsBy({owner_id: post._id, is_checked: false});
    if(post)
      return res.send({status: true, data: post, notifications});
    else
      return res.send({status: false, message: "something went wrong!"});
  }
}

const authWithTitter = async (req, res) => {

  const { url, codeVerifier, state } = client.generateOAuth2AuthLink(config.Twitter_redirect, { scope: ['tweet.read', 'users.read', 'offline.access'], state: req.body.walletAddress || "none" });
  return res.send({status: true, data: {url, codeVerifier}});
}

const loginWithTwitter = async (req, res) => {
  try {
    const { code, walletAddress, codeVerifier } = req.body;
    if (!codeVerifier || !code) {
      return res.status(400).send('You denied the app or your session expired!');
    }
    let { client: loggedClient, accessToken, refreshToken, expiresIn } = await client.loginWithOAuth2({ code, codeVerifier, redirectUri: config.Twitter_redirect });
    const { data: twitterInfo } = await loggedClient.v2.me();
    console.log("Twitter authorized", twitterInfo, walletAddress);

    const userDetail = await UserService.getUserBy({twitter_id: twitterInfo.id}); 
    if(userDetail){
      if(walletAddress != "none")
        return res.send({status: false, message: "Twitter already linked with an existing user"})


      let token = jwt.sign({ data: userDetail.walletAddress }, config.jwt_secret, { expiresIn: config.jwt_expire });
      let post = await UserService.updateUser(userDetail._id, {jwt_token : token});
      let notifications = await NotificationService.getNotificationsBy({owner_id: post._id, is_checked: false});
      if(post)
        return res.send({status: true, data: post, notifications});
      else
        return res.send({status: false, message: "something went wrong!"});

    }
    else{
      if(walletAddress == "none")
        return res.send({status: false, message: "wallet Address needed"})

      const newbieDetail = await UserService.getUserByWallet(walletAddress);
      if(newbieDetail){
        let token = jwt.sign({ data: newbieDetail.walletAddress }, config.jwt_secret, { expiresIn: config.jwt_expire });
        let post = await UserService.updateUser(newbieDetail._id, {jwt_token : token, twitter_id: twitterInfo.id, twitter_name: twitterInfo.username, signed: true});

        if(post){
          const currentRound = await RoundService.getCurrentRound();
          await TermresultService.makeTermresult({
            round_id: currentRound._id,
            owner_id: post._id,
            old_amount: post.usd_balance,
            current_amount: post.usd_balance
          });
          return res.send({status: true, data: post});

        }
        else
          return res.send({status: false, message: "something went wrong!"});
      }
      else
        return res.send({status: false, message: "please wallet connect for the first!"});
    }

  } catch (error) {
    console.log(error);
    return res.send({status: false, message: "something went wrong"});
  }
}

const authWithDiscord = async (req, res) => {
    const url =  oauth.generateAuthUrl({ 
      scope: "identify", 
      clientId: config.Discord_CLIENT_ID, 
      responseType: "code", 
      redirectUri: config.Discord_redirect, 
      state: req.body.walletAddress || "none"
    });
    return res.send({status: true, data: url});

  
}

const loginWithDiscord = async (req, res) => {
  try {

    if (!req.body.code) throw new Error('NoCodeProvided');

    const code = req.body.code;
    const walletAddress = req.body.walletAddress;
    const response = await oauth.tokenRequest({
      clientId: config.Discord_CLIENT_ID,
      clientSecret: config.Discord_CLIENT_SECRET,

      code: code,
      scope: "identify guilds",
      grantType: "authorization_code",
    
      redirectUri: config.Discord_redirect,
    });
    
    let discordInfo = await oauth.getUser(response.access_token);
    console.log(discordInfo, walletAddress);
    const userDetail = await UserService.getUserBy({discord_name: discordInfo.username, discord_discriminator: discordInfo.discriminator}); 
    if(userDetail){
      if(walletAddress != "none")
        return res.send({status: false, message: "Discord already linked with an existing user"})


      let token = jwt.sign({ data: userDetail.walletAddress }, config.jwt_secret, { expiresIn: config.jwt_expire });
      let post = await UserService.updateUser(userDetail._id, {jwt_token : token});
      let notifications = await NotificationService.getNotificationsBy({owner_id: post._id, is_checked: false});
      
      if(post)
        return res.send({status: true, data: post, notifications});
      else
        return res.send({status: false, message: "something went wrong!"});

    }
    else{
      if(walletAddress == "none")
        return res.send({status: false, message: "wallet Address needed"})

      const newbieDetail = await UserService.getUserByWallet(walletAddress);
      if(newbieDetail){
        let token = jwt.sign({ data: newbieDetail.walletAddress }, config.jwt_secret, { expiresIn: config.jwt_expire });
        let post = await UserService.updateUser(newbieDetail._id, {jwt_token : token, discord_name: discordInfo.username, discord_discriminator: discordInfo.discriminator, signed: true});

        if(post){
          const currentRound = await RoundService.getCurrentRound();
          await TermresultService.makeTermresult({
            round_id: currentRound._id,
            owner_id: post._id,
            old_amount: post.usd_balance,
            current_amount: post.usd_balance
          });
          return res.send({status: true, data: post});

        }
        else
          return res.send({status: false, message: "something went wrong!"});
      }
      else
        return res.send({status: false, message: "please wallet connect for the first!"});
    }
    
  } catch (error) {
    console.log(error);
    return res.send({status: false, message: "something went wrong!"})
  }
  
}

const getUserById = async (req, res) => {
	 try {
      const post = await UserService.getUserById(req.params.id);
      let notifications = await NotificationService.getNotificationsBy({owner_id: post._id, is_checked: false});
      if(post)
        return res.send({status: true, data: post, notifications});
      else
        return res.send({status: false, data: null});

    } catch {
      return res.send({status: false, data: null});

    }
}

const getUserByWallet = async (req, res) => {
  try {
    const post = await UserService.getUserByWallet(req.params.walletaddress);
    if(post)
      return res.send({status: true, data: post});
    else
      return res.send({status: false, data: null});

   } catch {
    return res.send({status: false, data: null});

   }
}
const updateUser = async (req, res) => {
	try {
      const post = await UserService.updateUser(req.body.id, {
        userName: req.body.userName
      }, req.files);

      if(!post)
        return res.send({status: false, message: "something went wrong!"});
      return res.send({status: true, data: post});

    } catch {
      return res.send({status: false, data: null});

    }
}

const resetUser = async (req, res) => {
  try {

    const post = await UserService.updateUser(req.body.userId, { 
      eth_balance: 0,
      eth_holding: 0,
      usd_balance: 5000,
      usd_holding: 0
    });

    const currentRound = await RoundService.getCurrentRound();
    await TermresultService.updateTermresult({ round_id: currentRound._id, owner_id: post._id}, {
      current_amount: post.usd_balance
    });

    const pendingOrders = await OrderService.getOrderBy({status: "pending"});
    pendingOrders.map(async (el) => {
      await OrderService.cancelOrder(el._id);
    })
    return res.send({status: true, data: post});

  } catch {
    return res.send({status: false, data: null});

  }
}

const deleteUser = async (req, res) => {
	try {
      const post = await UserService.deleteUser(req.params.id);
      return res.send({status: true, data: post});

    } catch {
      return res.send({status: false, data: null});

    }
}


module.exports = {
	getAllUsers,
	loginWithWallet,
  authWithDiscord,
  loginWithDiscord,
  authWithTitter,
  loginWithTwitter,
	getUserById,
  getUserByWallet,
	updateUser,
  resetUser,
	deleteUser
}