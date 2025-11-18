import type { Response, NextFunction, ErrorRequestHandler } from "express";
import { ResponseHandler, AppError } from "../utils";
import { type CustomRequest } from "./base-middleware";

export const createErrorHandler = (): ErrorRequestHandler => {
  return (
    err: unknown,
    req: CustomRequest,
    res: Response,
    _next: NextFunction
  ) => {
    if (err instanceof AppError) {
      ResponseHandler.error(res, err.message, err.statusCode, err.code);
      return;
    }

    if (err instanceof Error) {
      ResponseHandler.error(res, err.message, 500);
      return;
    }

    ResponseHandler.error(res, "Internal server error", 500);
  };
};
