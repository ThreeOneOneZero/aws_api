export interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  correlationId?: string;
}

export interface ApiInfo {
  name: string;
  version: string;
  environment: string;
}
