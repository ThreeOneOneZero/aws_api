import type { Response } from "express";
import type { ApiResponse, ApiErrorResponse, AppError } from "../types/index";

export class ResponseHandler {
  static success<T>(
    res: Response,
    data: T,
    statusCode = 200
  ): Response<ApiResponse<T>> {
    return res.status(statusCode).json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    } satisfies ApiResponse<T>);
  }

  static error(
    res: Response,
    message: string,
    statusCode = 500,
    code?: string
  ): Response<ApiErrorResponse> {
    return res.status(statusCode).json({
      success: false,
      message,
      code,
      timestamp: new Date().toISOString(),
    } satisfies ApiErrorResponse);
  }

  static fromError(res: Response, error: unknown): Response<ApiErrorResponse> {
    if (error instanceof Error && "statusCode" in error) {
      const appError = error as AppError;
      return this.error(
        res,
        appError.message,
        appError.statusCode,
        appError.code
      );
    }

    if (error instanceof Error) {
      return this.error(res, error.message, 500);
    }

    return this.error(res, "Internal server error", 500);
  }
}
