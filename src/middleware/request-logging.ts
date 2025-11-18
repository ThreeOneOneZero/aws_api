import { randomUUID } from "crypto";
import type { Response, NextFunction } from "express";
import { BaseMiddleware, type CustomRequest } from "./base-middleware";

export class RequestLoggingMiddleware extends BaseMiddleware {
  handle(req: CustomRequest, res: Response, next: NextFunction): void {
    const correlationId =
      (req.headers["x-correlation-id"] as string) || randomUUID();
    req.correlationId = correlationId;
    next();
  }
}
