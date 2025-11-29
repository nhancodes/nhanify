"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const homeController_1 = require("../controllers/homeController");
const homeRouter = (0, express_1.Router)();
homeRouter.get("/home", homeController_1.getHomePage);
module.exports = { homeRouter };
//# sourceMappingURL=homeRouter.js.map
