const UserService = require("../service/user");
const jwt = require('jsonwebtoken');
const config = require("../config");
const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token =  authHeader.split(' ')[1] || authHeader
        console.log("token", token);
        if (token == null) return res.send({status: false, message: "token error"});

        jwt.verify(token,  config.jwt_secret, async (err, decode) => {
            console.log(err)

            if (err) return res.send({status: false, message: "token error"});

            const user = await UserService.getUserByWallet(decode.data);
            if ( user.jwt_token != token)
                return res.send({status: false, message: "token error"});
            console.log("middleware", user.jwt_token != token)
            next()
        })
    } catch (error) {
        console.log(error)
        return res.send({status: false, message: "token error"})
    }
    
}

module.exports = {
    auth
}