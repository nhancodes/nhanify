import { Request, Response, NextFunction } from "express";

export const getHomePage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (req.get("x-partial")) {
    return res.render("partials/partial_home", {
      partial: true,
    });
  }
  return res.render("home", {
    partial: false,
  });
};

module.exports = { getHomePage };
