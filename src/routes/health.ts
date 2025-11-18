import { Router } from "express";
import { HealthController } from "../controllers";
import { ValidateAuthMiddleware } from "../middleware/validate-auth";

const router = Router();
const controller = new HealthController();
const authMiddleware = new ValidateAuthMiddleware();

// Rotas
router.get("/", controller.check);
router.get(
  "/info",
  (req, res, next) => authMiddleware.handle(req, res, next),
  controller.info
);

export default router;
