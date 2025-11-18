import { Router, Express } from "express";
import healthRoutes from "./health";
import userRoutes from "./user";

export function registerRoutes(router: Express): void {
  const apiRouter = Router();
  apiRouter.use("/users", userRoutes);
  apiRouter.use("/health", healthRoutes);

  router.use("/api", apiRouter);
}
