# Backend Node.js — Express + TypeScript

Template mínimo com arquitetura pronta:

## Stack

- Node.js 18+, Express, TypeScript (strict mode)
- Controllers → Services → Models (camadas separadas)
- ResponseHandler (type-safe HTTP responses)
- AsyncHandler (wrapper para async/await)
- Error handling global com AppError
- Middleware pattern com extends BaseMiddleware

## Estrutura

```
src/
├── types/response.ts          # Tipos HTTP (ApiResponse, AppError)
├── utils/response-handler.ts  # ResponseHandler centralizado
├── middleware/                # Middlewares de Express
├── controllers/               # Request handlers (Extendem BaseController)
├── services/                  # Lógica de negócio (Extendem BaseService)
├── handlers/                  # AsyncHandler wrapper
├── routes/                    # Definição de rotas
└── models/                    # Tipos do domínio
```

## Como Começar

1. `npm install`
2. `npm run dev` (inicia servidor em :3000)
3. Teste: `GET http://localhost:3000/health`

## Padrão para Novo Endpoint

```typescript
// 1. Modelo (src/models/user.ts)
interface User { id: string; name: string; }

// 2. Serviço (src/services/user.ts)
class UserService extends BaseService {
  getUser(id: string): User { ... }
}

// 3. Controller (src/controllers/user.ts)
class UserController extends BaseController {
  getUser = asyncHandler(async (req, res) => {
    return this.success(res, this.service.getUser(req.params.id));
  });
}

// 4. Rota (src/routes/user.ts)
router.get("/:id", controller.getUser);

// 5. Registrar (src/routes/index.ts)
router.use("/api/users", userRoutes);
```

## Próximas Adições

- Banco de dados (Prisma)
- Validação de input (Zod)
- JWT authentication
- Testes
