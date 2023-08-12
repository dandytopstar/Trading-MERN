const mongoose = require("mongoose");

const schema = mongoose.Schema({
  price: {type: Number, default: 0},
  name: {type: String, required: true},
  symbol: {type: String, required: true, unique: true},
  updated: {type: Date, default: Date.now},
  created: {type: Date, default: Date.now},
  deleted: {type: Boolean, default: false}
});

module.exports = mongoose.model("Cryptocurrency", schema);
