import { Request, Response, NextFunction } from "express";

export const getHomePage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.render("partials/partial_home", {
      message: "Welcome to the home page",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getHomePage };
