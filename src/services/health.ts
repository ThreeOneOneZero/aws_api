import { BaseService } from "./base-service";

export class HealthService extends BaseService {
  checkHealth(): { status: "ok" } {
    return { status: "ok" };
  }

  getInfo(): {
    name: string;
    version: string;
    environment: string;
  } {
    return {
      name: "Node Backend Template",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
    };
  }
}
