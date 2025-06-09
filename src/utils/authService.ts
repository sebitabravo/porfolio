import crypto from 'crypto';
import { CONFIG } from './config.js';

export interface AuthResponse {
  success: boolean;
  error?: string;
  token?: string;
}

// Almacenamiento en memoria para rate limiting (simple implementación)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  return 'unknown';
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function validatePassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword;
}

export function authenticateUser(password: string): AuthResponse {
  // Verificar que la variable de entorno esté configurada
  if (!CONFIG.ADMIN_PASSWORD_HASH) {
    return {
      success: false,
      error: 'Configuración de seguridad incompleta. ADMIN_PASSWORD_HASH no está configurado.'
    };
  }

  if (validatePassword(password, CONFIG.ADMIN_PASSWORD_HASH)) {
    return {
      success: true,
      token: generateSessionToken()
    };
  }
  return {
    success: false,
    error: 'Contraseña incorrecta'
  };
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function isRateLimited(ip: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const key = `${ip}-${Math.floor(now / windowMs)}`;

  const current = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs };

  if (now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (current.count >= limit) {
    return true;
  }

  current.count++;
  rateLimitStore.set(key, current);
  return false;
}

export function isGloballyRateLimited(ip: string): boolean {
  return isRateLimited(ip, 100, 60000); // 100 requests per minute globally
}

export function recordAttempt(ip: string): void {
  // Simple implementation - just increment the rate limit counter
  const now = Date.now();
  const key = `attempt-${ip}`;
  const current = rateLimitStore.get(key) || { count: 0, resetTime: now + 3600000 }; // 1 hour window
  current.count++;
  rateLimitStore.set(key, current);
}

export function getRemainingAttempts(ip: string, limit: number = 10): number {
  const now = Date.now();
  const key = `attempt-${ip}`;
  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    return limit;
  }

  return Math.max(0, limit - current.count);
}
