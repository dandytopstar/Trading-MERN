const UserService = require("../service/user");
const winnerAuth = async (req, res, next) => {
    try {
        if(!req.body.userId)
            return res.send({status: false, message: "user info not correct!"});

        const userDetail = await UserService.getUserById(req.body.userId);
        if(userDetail.is_winner)
          return res.send({status: false, message: "Already you are an winner, not allowed to trade/reset"});

        next();
    } catch (error) {
        console.log(error)
        return res.send({status: false, message: "token error"})
    }
    
}

module.exports = {
    winnerAuth
}