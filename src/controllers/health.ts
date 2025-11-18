import type { Response } from "express";
import { asyncHandler } from "../handlers";
import { BaseController } from "./base-controller";
import type { CustomRequest } from "../middleware";
import { HealthService } from "../services";

export class HealthController extends BaseController {
  private service = new HealthService();

  // ✅ Usando asyncHandler para tratamento automático de erros
  check = asyncHandler(async (req: CustomRequest, res: Response) => {
    const data = this.service.checkHealth();
    return this.success(res, {
      ...data,
      timestamp: new Date().toISOString(),
      correlationId: req.correlationId,
    });
  });

  // ✅ Pode ser também sem async (não precisa de asyncHandler)
  info = (req: CustomRequest, res: Response) => {
    const data = this.service.getInfo();
    return this.success(res, {
      ...data,
      timestamp: new Date().toISOString(),
      correlationId: req.correlationId,
    });
  };
}
