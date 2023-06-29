import { Request, Response, NextFunction } from "express";
import type { IResponse } from "./interfaces";

export const missingEmailField = (
  req: Request,
  res: Response,
  next: NextFunction
): Response<IResponse> | void => {
  const { email }: { email: string } = req.body;

  if (!email) {
    return res.status(400).json({
      ok: false,
      statusCode: 400,
      message: "Email Field Is Required",
      details: "",
    });
  }
  next();
};

export const missingPasswordField = (
  req: Request,
  res: Response,
  next: NextFunction
): Response<IResponse> | void => {
  const { password }: { password: string } = req.body;

  if (!password) {
    return res.status(400).json({
      ok: false,
      statusCode: 400,
      message: "Password Field Is Required",
      details: "",
    });
  }
  next();
};
