import { Request, Response, NextFunction } from "express";

export const getHomePage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (req.get("x-partial")) {
    return res.render("partials/partial_home", {
      message: "Partial home page",
    });
  }
  return res.render("home", {
    message: "Not a partial home page",
  });
};

module.exports = { getHomePage };
