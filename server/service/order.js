const Order = require("../models/order");
const UserService = require("./user");
const config = require("../config");


const getAllOrders = async () => {
	const posts = await Order.find();
  return posts;
}


const getOrderById = async (id) => {
	 try {
      const post = await Order.findOne({ _id: id });
      return post;
    } catch {
      return null;
    }
}

const getOrderByUserId = async (userId) => {
  try {
    const post = await Order.find({ order_owner: userId });
    return post;
    } catch {
    return null;
   }
}

const getOrderByUserWallet = async (walletAddress) => {
  try {
    const userDetail = await UserService.getUserByWallet(walletAddress);
    const post = await Order.find({ owner: userDetail._id });
    return post;
    } catch {
    return null;
   }
}

const getOrderBy = async (payload) => {
  try{
    const post = await Order.find(payload);
    return post;
  }catch(err){
    return null;
  }
}

const makeOrder = async (payload) => {
  try {
    if(!payload.userId || !payload.amount || !payload.price)
      return null;

    const post = new Order({
      order_owner: payload.userId,
      order_type: payload.orderType || "buy",
      amount: parseFloat(payload.amount),
      price: parseFloat(payload.price),
      total: parseFloat(payload.amount) * parseFloat(payload.price),
      duration: parseInt(payload.duration || 0),
      order_mode: payload.orderMode || "limit",
      status: payload.status || "pending",
      created: Date.now()
    });
    await post.save();
    return post;
  } catch {
    return null;
  }
}

const cancelOrder = async (id) => {
	try {
      const post = await Order.findOne({ _id: id });
      if(post.status != "pending")
        return null;
      post.status = "canceled";
      await post.save();

      return post;
    } catch {
      return null;
    }
}

const confirmOrder = async (id) => {
  try {
    const post = await Order.findOne({ _id: id });
    if(post.status != "pending")
      return null;
    post.status = "executed";
    await post.save();

    return post;
  } catch {
    return null;
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  getOrderByUserId,
  getOrderByUserWallet,
  getOrderBy,
  makeOrder,
	cancelOrder,
  confirmOrder
}