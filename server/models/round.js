const mongoose = require("mongoose");

const schema = mongoose.Schema({
  winners: [Object],
  duration: {type: Number, default: 0},
  created: {type: Date, default: Date.now()},
  status: {type:String, default: "pending"}
});

module.exports = mongoose.model("Round", schema);
