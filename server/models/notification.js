const mongoose = require("mongoose");

const schema = mongoose.Schema({
  owner_id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  message: String,
  notification_type: {type: String, default: "congratulation"},
  created: {type: Date, default: Date.now()},
  is_checked: {type: Boolean, default: false}
});

module.exports = mongoose.model("Notification", schema);
