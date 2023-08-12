const mongoose = require("mongoose");

const schema = mongoose.Schema({
  order_owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  order_type: {type: String, default: "buy"},
  order_mode: {type: String, default: "limit"},
  amount: {type: Number, default: 0},
  price: {type: Number, default: 0},
  total: {type: Number, default: 0},
  duration: {type: Number, default: 0},
  created: {type: Date, default: Date.now()},
  status: {type:String, default: "pending"}
});

module.exports = mongoose.model("Order", schema);
