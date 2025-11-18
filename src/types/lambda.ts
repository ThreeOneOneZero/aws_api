// Tipos para HTTP API (API Gateway v2)
export interface LambdaEvent {
  requestContext: {
    http: {
      method: string;
      path: string;
    };
  };
  rawPath: string;
  pathParameters?: Record<string, string>;
  body?: string;
}

export interface LambdaResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

export type RouteHandler = (
  pathParams: Record<string, string>,
  body: any
) => Promise<{ statusCode: number; data: any }>;

export interface Route {
  pattern: RegExp;
  handler: RouteHandler;
}
