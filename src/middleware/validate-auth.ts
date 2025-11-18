import type { Response, NextFunction } from "express";
import { BaseMiddleware, type CustomRequest } from "./base-middleware";
import { AppError } from "../utils";

export class ValidateAuthMiddleware extends BaseMiddleware {
  handle(req: CustomRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError(401, "Missing authorization header", "MISSING_AUTH");
    }

    // Exemplo: extrair userId do token (simplificado)
    const token = authHeader.replace("Bearer ", "");
    if (token === "invalid") {
      throw new AppError(401, "Invalid token", "INVALID_TOKEN");
    }

    // Simular extração do userId
    req.userId = "user-123";
    next();
  }
}
