const NotificationService = require("../service/notification");

const updateNotification = async (req, res) => {

  if(!req.params.id)
    return res.send({status: false, message: "notification ID needed!"});

	const post = await NotificationService.updateNotification(req.params.id, {is_checked: true});
  return res.send({status: true, data: post});
}


module.exports = {
  updateNotification
}