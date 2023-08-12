const mongoose = require("mongoose");

const schema = mongoose.Schema({
  round_id: {type: mongoose.Schema.Types.ObjectId, ref: "Round"},
  owner_id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  current_amount: {type: Number, default: 0},
  old_amount: {type: Number, default: 0},
  lost_amount: {type: Number, default: 0},
  created: {type: Date, default: Date.now()},
  status: {type:String, default: "pending"}
});

// schema.virtual('lost_amount').get(function(){
//   return this.old_amount - this.current_amount
// })

// schema.pre('updateOne', function(next){
//   // this.lost_amount = this.old_amount - this.current_amount;
//   // this.lost_amount = this.old_amount - this._update['current_amount'];
//   // const lost = this._current.old_amount - this.getUpdate().current_amount;
//   // this.getUpdate().$set.lost_amount = lost;
//   // const lost = this._conditions.old_amount - this.getUpdate().current_amount;
//   // this.getUpdate().$set.lost_amount = lost;
//   // console.log("pre middleware", this._conditions);
//   return next()
// })


module.exports = mongoose.model("Termresult", schema);
