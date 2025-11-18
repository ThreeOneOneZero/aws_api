import { BaseService } from "./base-service";
import { AppError } from "../types/response";
import { CreateUserInput, UpdateUserInput } from "../schemas";

// Em produção, isso viria do Prisma
const users: any[] = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
];

export class UserService extends BaseService {
  async create(data: CreateUserInput) {
    // Verificar se email já existe
    if (users.find((u) => u.email === data.email)) {
      throw new AppError(409, "Email already exists", "EMAIL_EXISTS");
    }

    const user = {
      id: String(Math.random()),
      ...data,
    };

    users.push(user);
    return user;
  }

  async list() {
    return users;
  }

  async getById(id: string) {
    const user = users.find((u) => u.id === id);
    if (!user) {
      throw new AppError(404, "User not found", "USER_NOT_FOUND");
    }
    return user;
  }

  async update(id: string, data: UpdateUserInput) {
    const user = users.find((u) => u.id === id);
    if (!user) {
      throw new AppError(404, "User not found", "USER_NOT_FOUND");
    }

    Object.assign(user, data);
    return user;
  }

  async delete(id: string) {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new AppError(404, "User not found", "USER_NOT_FOUND");
    }

    users.splice(index, 1);
  }
}
