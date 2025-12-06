import { Router } from "express";
import { getHomePage } from "../controllers/homeController";
const catchError = require("./catch-error.js");

const homeRouter = Router();

homeRouter.get("/home", catchError(getHomePage));

module.exports = { homeRouter };
