const Notification = require("../models/notification");


const getNotificationsBy = async (identify) => {
	const posts = await Notification.find(identify);
  return posts;
}

const getAllNotifications = async () => {
	const posts = await Notification.find();
  return posts;
}

const addNotification = async (payload) => {
  const post = await Notification(payload);
  await post.save();
  return post;
}

const updateNotification = async (id, payload) => {
  try{
    await Notification.updateOne({_id: id}, payload);
    return Notification.findOne({_id: id});
  }catch(error){
    console.log(error)
    return null;
  }
}


module.exports = {
  getNotificationsBy,
  getAllNotifications,
  addNotification,
  updateNotification
}