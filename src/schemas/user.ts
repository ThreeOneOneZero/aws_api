import { z } from "zod";

// Exemplo: User schemas
export const CreateUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.email("Invalid email format"),
  age: z.number().int().positive("Age must be positive").optional(),
});

export const UpdateUserSchema = CreateUserSchema.partial();

// Exemplo: Product schemas
export const CreateProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.number().positive("Price must be positive"),
  description: z.string().optional(),
});

// Reutilizável para qualquer entidade
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
