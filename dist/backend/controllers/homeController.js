"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHomePage = void 0;
const getHomePage = async (req, res, next) => {
  try {
    res.render("partials/partial_home", {
      message: "Welcome to the home page",
    });
  } catch (err) {
    next(err);
  }
};
exports.getHomePage = getHomePage;
module.exports = { getHomePage: exports.getHomePage };
//# sourceMappingURL=homeController.js.map
