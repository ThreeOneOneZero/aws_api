import type { Response } from "express";
import { asyncHandler } from "../handlers";
import { BaseController } from "./base-controller";
import type { CustomRequest } from "../middleware";
import { UserService } from "../services";

export class UserController extends BaseController {
  private service = new UserService();

  // Criar usuário (com validação automática via middleware)
  create = asyncHandler(async (req: CustomRequest, res: Response) => {
    const user = await this.service.create(req.body);
    return this.success(res, user, 201);
  });

  // Listar usuários
  list = asyncHandler(async (req: CustomRequest, res: Response) => {
    const users = await this.service.list();
    return this.success(res, users);
  });

  // Buscar por ID
  getById = asyncHandler(async (req: CustomRequest, res: Response) => {
    const user = await this.service.getById(req.params.id);
    return this.success(res, user);
  });

  // Atualizar usuário (com validação automática via middleware)
  update = asyncHandler(async (req: CustomRequest, res: Response) => {
    const user = await this.service.update(req.params.id, req.body);
    return this.success(res, user);
  });

  // Deletar usuário
  delete = asyncHandler(async (req: CustomRequest, res: Response) => {
    await this.service.delete(req.params.id);
    return this.success(res, { message: "User deleted" });
  });
}
