const mongoose = require("mongoose");

const schema = mongoose.Schema({
  walletAddress: {type: String, required: true, unique: true},
  userName: String,
  userAvatar: String,
  discord_name: String,
  discord_discriminator: String,
  twitter_id: String,
  twitter_username: String,
  signed: {type: Boolean, default: false},
  is_winner: {type: Boolean, default: false},
  eth_balance: { type: Number, default: 0},
  eth_holding: { type: Number, default: 0},
  usd_balance: { type: Number, default: 5000},
  usd_holding: { type: Number, default: 0},
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  removed: Date,
  deleted: { type: Boolean, default: false },
  role: {type: String, default: "user"},
  jwt_token: String,
  socket_id: String,
});

module.exports = mongoose.model("User", schema);
