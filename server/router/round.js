/* learn more: https://github.com/testing-library/jest-dom // @testing-library/jest-dom library provides a set of custom jest matchers that you can use to extend jest. These will make your tests more declarative, clear to read and to maintain.*/ 

const RoundController = require("../controller/round");

module.exports = (router) => {
  router.get("/currentround", RoundController.getCurrentRound);
}

