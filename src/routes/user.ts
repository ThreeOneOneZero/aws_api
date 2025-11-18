import { Router } from "express";
import { UserController } from "../controllers";
import { ValidateSchemaMiddleware } from "../middleware";
import { CreateUserSchema, UpdateUserSchema } from "../schemas";

const router = Router();
const controller = new UserController();

const validateCreate = new ValidateSchemaMiddleware(CreateUserSchema);
const validateUpdate = new ValidateSchemaMiddleware(UpdateUserSchema);

// Rotas CRUD
router.post(
  "/",
  (req, res, next) => validateCreate.handle(req, res, next),
  controller.create
);
router.get("/", controller.list);
router.get("/:id", controller.getById);
router.put(
  "/:id",
  (req, res, next) => validateUpdate.handle(req, res, next),
  controller.update
);
router.delete("/:id", controller.delete);

export default router;
