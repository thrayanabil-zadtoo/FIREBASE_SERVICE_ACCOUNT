import { Application } from 'express';
import { registerDarbAISecurityRoutes, SecurityRouteOptions } from './darb-ai-security-routes';

export function registerDarbAISecurity(app: Application, options: SecurityRouteOptions = {}) {
  registerDarbAISecurityRoutes(app, options);
}

export { registerDarbAISecurityRoutes };
