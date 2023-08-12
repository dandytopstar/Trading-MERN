const mongoose = require("mongoose");

const schema = mongoose.Schema({
  round_duration: {type: Number, default: 3600},
  amount_winners: {type: Number, default: 3}
});

module.exports = mongoose.model("Setting", schema);
