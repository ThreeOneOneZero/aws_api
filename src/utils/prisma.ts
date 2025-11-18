// Exemplo de configuração do Prisma
// Este arquivo é OPCIONAL e serve como referência

// 1. Criar prisma/schema.prisma:
// datasource db {
//   provider = "postgresql"
//   url      = env("DATABASE_URL")
// }
//
// generator client {
//   provider = "prisma-client-js"
// }
//
// model User {
//   id    Int     @id @default(autoincrement())
//   email String  @unique
//   name  String?
// }

// 2. No package.json, adicionar scripts:
// "prisma:generate": "prisma generate",
// "prisma:migrate": "prisma migrate dev",
// "prisma:studio": "prisma studio"

// 3. Criar PrismaClient singleton:
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
