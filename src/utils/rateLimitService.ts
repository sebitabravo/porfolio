import { getClientIP } from './authService.js';
import type { CreateLinkRequest, CreateLinkResponse } from './linkShortener/types.js';

export interface CreationAttempt {
  ip: string;
  timestamp: number;
  successful: boolean;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// Almacenamiento en memoria para rate limiting de creación
const creationAttempts = new Map<string, CreationAttempt[]>();

export function isCreationRateLimited(ip: string, maxAttempts: number = 5, windowMs: number = 300000): boolean {
  const now = Date.now();
  const attempts = creationAttempts.get(ip) || [];

  // Filtrar intentos dentro de la ventana de tiempo
  const recentAttempts = attempts.filter(attempt => now - attempt.timestamp < windowMs);
  creationAttempts.set(ip, recentAttempts);

  return recentAttempts.length >= maxAttempts;
}

export function recordCreationAttempt(ip: string, successful: boolean = true): void {
  const attempts = creationAttempts.get(ip) || [];
  attempts.push({
    ip,
    timestamp: Date.now(),
    successful
  });
  creationAttempts.set(ip, attempts);
}

export function validateCreateLinkRequest(request: CreateLinkRequest): ValidationResult {
  if (!request.url || typeof request.url !== 'string') {
    return { valid: false, error: 'URL es requerida' };
  }

  if (request.url.length > 2048) {
    return { valid: false, error: 'URL demasiado larga' };
  }

  if (request.customPath && typeof request.customPath !== 'string') {
    return { valid: false, error: 'Path personalizado debe ser una cadena' };
  }

  return { valid: true };
}

export function createLinkWithValidation(request: CreateLinkRequest, ip: string): CreateLinkResponse {
  // Validar rate limiting
  if (isCreationRateLimited(ip)) {
    recordCreationAttempt(ip, false);
    return {
      success: false,
      error: 'Demasiados intentos. Espera 5 minutos antes de crear otro enlace.'
    };
  }

  // Validar request
  const validation = validateCreateLinkRequest(request);
  if (!validation.valid) {
    recordCreationAttempt(ip, false);
    return {
      success: false,
      error: validation.error
    };
  }

  // Aquí se llamaría a la función de creación real
  // Por ahora retornamos un placeholder
  recordCreationAttempt(ip, true);
  return {
    success: true,
    shortUrl: 'placeholder',
    shortCode: 'placeholder'
  };
}

// Re-export de utilidades necesarias
export { getClientIP };

// Re-export de tipos
export type {
  CreateLinkRequest,
  CreateLinkResponse
} from './linkShortener/types.js';
