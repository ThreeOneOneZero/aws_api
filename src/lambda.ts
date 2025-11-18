import { TaskService } from "./services";
import { CreateTaskSchema, UpdateTaskSchema } from "./schemas";
import { AppError } from "./types/response";
import { LambdaEvent, LambdaResponse, Route, RouteHandler } from "./types";

const taskService = new TaskService();
// ========================================
// HELPER FUNCTIONS
// ========================================

function createResponse(statusCode: number, body: any): LambdaResponse {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    body: JSON.stringify(body),
  };
}

function successResponse(statusCode: number, data: any) {
  return {
    statusCode,
    data: {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
  };
}

// ========================================
// ROUTE HANDLERS (Controllers)
// ========================================

const handlers = {
  // POST /tasks - Criar tarefa
  createTask: async (_params: any, body: any) => {
    const validated = CreateTaskSchema.parse(body);
    const result = await taskService.create(validated);
    return successResponse(201, result);
  },

  // GET /tasks - Listar todas
  listTasks: async () => {
    const result = await taskService.list();
    return successResponse(200, result);
  },

  // GET /tasks/{id} - Buscar por ID
  getTask: async (params: any) => {
    const result = await taskService.getById(params.id);
    return successResponse(200, result);
  },

  // GET /tasks/date/{date} - Buscar por data
  getTasksByDate: async (params: any) => {
    const result = await taskService.getByDate(params.date);
    return successResponse(200, result);
  },

  // PUT /tasks/{id} - Atualizar
  updateTask: async (params: any, body: any) => {
    const validated = UpdateTaskSchema.parse(body);
    const result = await taskService.update(params.id, validated);
    return successResponse(200, result);
  },

  // DELETE /tasks/{id} - Deletar
  deleteTask: async (params: any) => {
    await taskService.delete(params.id);
    return successResponse(200, { message: "Task deleted successfully" });
  },
};

// ========================================
// ROUTER CONFIGURATION
// ========================================

const routes: Record<string, Route[]> = {
  POST: [
    {
      pattern: /^\/tasks$/,
      handler: handlers.createTask,
    },
  ],
  GET: [
    {
      pattern: /^\/tasks$/,
      handler: handlers.listTasks,
    },
    {
      pattern: /^\/tasks\/date\/(?<date>[^/]+)$/,
      handler: handlers.getTasksByDate,
    },
    {
      pattern: /^\/tasks\/(?<id>[^/]+)$/,
      handler: handlers.getTask,
    },
  ],
  PUT: [
    {
      pattern: /^\/tasks\/(?<id>[^/]+)$/,
      handler: handlers.updateTask,
    },
  ],
  DELETE: [
    {
      pattern: /^\/tasks\/(?<id>[^/]+)$/,
      handler: handlers.deleteTask,
    },
  ],
};

// ========================================
// ROUTER LOGIC
// ========================================

function findRoute(method: string, path: string): RouteHandler | null {
  const methodRoutes = routes[method];
  if (!methodRoutes) return null;

  for (const route of methodRoutes) {
    const match = path.match(route.pattern);
    if (match) {
      // Retorna handler com params extraídos
      return async (_, body) => {
        const params = match.groups || {};
        return route.handler(params, body);
      };
    }
  }

  return null;
}

// ========================================
// LAMBDA HANDLER
// ========================================

export const handler = async (event: LambdaEvent): Promise<LambdaResponse> => {
  try {
    const method = event.requestContext.http.method;
    const path = event.rawPath;
    const body = event.body ? JSON.parse(event.body) : null;

    console.log(`[Lambda] ${method} ${path}`, { body });

    const routeHandler = findRoute(method, path);

    if (!routeHandler) {
      return createResponse(404, {
        success: false,
        error: {
          message: `Route ${method} ${path} not found`,
          code: "ROUTE_NOT_FOUND",
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Executar handler
    const result = await routeHandler({}, body);
    return createResponse(result.statusCode, result.data);
  } catch (error: any) {
    console.error("[Lambda Error]", error);

    // Tratamento de erro
    if (error instanceof AppError) {
      return createResponse(error.statusCode, {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Erro de validação Zod
    if (error.name === "ZodError") {
      return createResponse(400, {
        success: false,
        error: {
          message: "Validation error",
          code: "VALIDATION_ERROR",
          details: error.errors,
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Erro genérico
    return createResponse(500, {
      success: false,
      error: {
        message: "Internal server error",
        code: "INTERNAL_ERROR",
      },
      timestamp: new Date().toISOString(),
    });
  }
};
