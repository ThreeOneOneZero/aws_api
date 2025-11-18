import express from "express";
import cors from "cors";
import config from "./config";
import { registerRoutes } from "./routes";
import {
  RequestLoggingMiddleware,
  createErrorHandler,
  type CustomRequest,
} from "./middleware";
import { ResponseHandler } from "./utils";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Request logging
const loggingMiddleware = new RequestLoggingMiddleware();
app.use((req: CustomRequest, res, next) => {
  loggingMiddleware.handle(req, res, next);
});

// Routes
registerRoutes(app);

// 404 handler
app.use((req, res) => {
  ResponseHandler.error(res, `Route ${req.method} ${req.path} not found`, 404);
});

// Error handler (deve ser o último)
app.use(createErrorHandler());

const server = app.listen(config.port, () => {
  console.log(`✅ Server running on port ${config.port} (${config.nodeEnv})`);
});

export default server;
