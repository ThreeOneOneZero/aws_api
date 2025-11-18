import type { Response } from "express";
import { ResponseHandler } from "../utils";

export abstract class BaseController {
  protected success<T>(res: Response, data: T, statusCode = 200): Response {
    return ResponseHandler.success(res, data, statusCode);
  }

  protected error(
    res: Response,
    message: string,
    statusCode = 500,
    code?: string
  ): Response {
    return ResponseHandler.error(res, message, statusCode, code);
  }
}
