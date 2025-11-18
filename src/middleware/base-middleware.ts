import type { Request, Response, NextFunction } from "express";

export interface CustomRequest extends Request {
  userId?: string;
  correlationId?: string;
}

export abstract class BaseMiddleware {
  abstract handle(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): void | Promise<void>;
}
