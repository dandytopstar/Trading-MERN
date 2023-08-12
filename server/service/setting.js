const Setting = require("../models/setting");


const getSettingInfo = async () => {
  const settings = await Setting.find();
  if(settings.length > 0){
    return {
      roundDuration : settings[0].round_duration,
      winnerAmount: settings[0].amount_winners
    }
  } else
    return null;
}

const updateSettingInfo = async () => {

}

const initSettingInfo = async () => {
  const settings = await Setting.find();
  if(settings.length > 0)
    return null;
  
  const initSetting = new Setting();
  await initSetting.save();
  return initSetting;
}

module.exports = {
  getSettingInfo,
  updateSettingInfo,
  initSettingInfo
}