import { Router } from "express";
import { getHomePage } from "../controllers/homeController";
const homeRouter = Router();
homeRouter.get("/home", getHomePage);

module.exports = { homeRouter };
