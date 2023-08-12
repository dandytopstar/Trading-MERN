const OrderService = require("../service/order");
const UserService = require("../service/user");

const getAllOrders = async (req, res) => {
	const posts = await OrderService.getAllOrders();
  return res.send({status: true, data: posts});
}


const getOrderById = async (req, res) => {
	 try {
      const post = await OrderService.getOrderById(req.params.id);
      return res.send({status: true, data: post});
    } catch {
      return res.send({status: false, message: "something wrong"});
    }
}

const getOrderByUserId = async (req, res) => {
  try {
     const post = await OrderService.getOrderByUserId(req.params.userid);
     return res.send({status: true, data: post});
   } catch {
      return res.send({status: false, message: "something wrong"});
   }
}

const getOrderByUserWallet = async (req, res) => {
  try {
     const post = await OrderService.getOrderByUserWallet(req.params.walletaddress);
     return res.send({status: true, data: post});
   } catch {
    return res.send({status: false, message: "something wrong"});
   }
}

const makeOrder = async (req, res) => {
  try {
    if(!req.body.userId)
      return res.send({status: false, message: "User not correct"});
    if(!req.body.amount)
      return res.send({status: false, message: "ETH amount not correct"});
    if(!req.body.price)
      return res.send({status: false, message: "Price not correct"});
    
    const userDetail = await UserService.getUserById(req.body.userId);
    let updatedUser;
    
    
    if((req.body.orderType || "buy") == "buy"){
      if(userDetail.usd_balance < parseFloat(req.body.price) * parseFloat(req.body.amount))
        return res.send({status: false, message: "balance not correct"})

      updatedUser = await UserService.updateUser(userDetail._id, {
        usd_balance: userDetail.usd_balance - parseFloat(req.body.price) * parseFloat(req.body.amount),
        usd_holding: userDetail.usd_holding + parseFloat(req.body.price) * parseFloat(req.body.amount)
      })
    }
    else {
      console.log(userDetail.eth_balance, req.body.amount)
      if(userDetail.eth_balance < parseFloat(req.body.amount))
        return res.send({status: false, message: "balance not correct"})
        
      updatedUser = await UserService.updateUser(userDetail._id, {
        eth_balance: userDetail.eth_balance - parseFloat(req.body.amount),
        eth_holding: userDetail.eth_holding + parseFloat(req.body.amount)
      })
    }

    await OrderService.makeOrder(req.body);
    const ordersByUserId = await OrderService.getOrderByUserId(req.body.userId);

    return res.send({status: true, data: updatedUser, orderHistory: ordersByUserId});
  } catch {
    return res.send({status: false, message: "something wrong"});
  }
}
const cancelOrder = async (req, res) => {
	try {
      const post = await OrderService.cancelOrder(req.body.id);
      if(!post)
        return res.send({status: false, message: "order not found"});
      let userDetail = await UserService.getUserById(post.order_owner);
      let userUpdated;
      if(post.order_type == "buy"){
        userUpdated = await UserService.updateUser(userDetail._id, {
          usd_balance: userDetail.usd_balance + parseFloat(post.price) * parseFloat(post.amount),
          usd_holding: userDetail.usd_holding - parseFloat(post.price) * parseFloat(post.amount)
        });
      }

      if(post.order_type == "sell"){
        userUpdated = await UserService.updateUser(userDetail._id, {
          eth_balance: userDetail.eth_balance + parseFloat(post.amount),
          eth_holding: userDetail.eth_holding - parseFloat(post.amount)
        });
      }
      const ordersByUserId = await OrderService.getOrderByUserId(post.order_owner);

      return res.send({status: true, data: userUpdated, orderHistory: ordersByUserId});
    } catch {
      return res.send({status: false, message: "something wrong"});
    }
}

const makeMarket = async (req, res) => {
  try {
    if(!req.body.userId)
      return res.send({status: false, message: "User not correct"});
    if(!req.body.amount)
      return res.send({status: false, message: "ETH amount not correct"});
    if(!req.body.price)
      return res.send({status: false, message: "Price not correct"});
    
    const userDetail = await UserService.getUserById(req.body.userId);
    
    
    
    if((req.body.orderType || "buy") == "buy"){
      if(userDetail.usd_balance < parseFloat(req.body.price) * parseFloat(req.body.amount))
      return res.send({status: false, message: "balance not correct"})

      await UserService.updateUser(userDetail._id, {
        usd_balance: userDetail.usd_balance - parseFloat(req.body.price) * parseFloat(req.body.amount),
        eth_balance: userDetail.eth_balance + parseFloat(req.body.amount)
      })
    }
    else {
      if(userDetail.eth_balance < parseFloat(req.body.amount))
        return res.send({status: false, message: "balance not correct"})
        
      await UserService.updateUser(userDetail._id, {
        eth_balance: userDetail.eth_balance - parseFloat(req.body.amount),
        usd_balance: userDetail.usd_balance + parseFloat(req.body.price) * parseFloat(req.body.amount)
      })
    }
    const updatedUser = await UserService.getUserById(req.body.userId);
    await OrderService.makeOrder({...req.body, orderMode: "market", status: "executed"});
    const ordersByUserId = await OrderService.getOrderByUserId(req.body.userId);
    return res.send({status: true, data: updatedUser, orderHistory: ordersByUserId});
  } catch {
    return res.send({status: false, message: "something wrong"});
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  getOrderByUserId,
  getOrderByUserWallet,
  makeOrder,
	cancelOrder,
  makeMarket
}