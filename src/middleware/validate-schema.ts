import type { Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { BaseMiddleware, type CustomRequest } from "./base-middleware";
import { AppError } from "../types/response";

export class ValidateSchemaMiddleware extends BaseMiddleware {
  constructor(private schema: z.ZodType) {
    super();
  }

  handle(req: CustomRequest, res: Response, next: NextFunction): void {
    try {
      const validated = this.schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("; ");
        throw new AppError(400, message, "VALIDATION_ERROR");
      }
      throw error;
    }
  }
}
