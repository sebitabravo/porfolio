/**
 * Endpoint para recibir reportes de violación de Content Security Policy (CSP)
 * Optimizado para Vercel free tier con rate limiting agresivo
 */

export const prerender = false;

import type { APIRoute } from 'astro';
import { getClientIP } from '../../utils/authService';
import { recordAttackPattern } from '../../utils/securityMonitor';
import { vercelOptimizer } from '../../utils/vercelOptimizer';
import { createJSONResponse } from '../../utils/responseUtils';

// Rate limiting específico para reportes CSP (muy restrictivo)
const cspReports = new Map<string, { count: number; lastReport: number }>();
const MAX_CSP_REPORTS = 5; // Máximo 5 reportes por IP por hora
const CSP_WINDOW = 60 * 60 * 1000; // 1 hora

function isCSPReportRateLimited(ip: string): boolean {
  const now = Date.now();
  const data = cspReports.get(ip);

  if (!data) {
    cspReports.set(ip, { count: 1, lastReport: now });
    return false;
  }

  // Reset si ha pasado la ventana
  if (now - data.lastReport > CSP_WINDOW) {
    cspReports.set(ip, { count: 1, lastReport: now });
    return false;
  }

  data.count++;
  return data.count > MAX_CSP_REPORTS;
}

export const POST: APIRoute = async ({ request }) => {
  const requestId = `csp-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  vercelOptimizer.startExecutionTimer(requestId);

  try {
    const clientIP = getClientIP(request);

    // Rate limiting específico para CSP
    if (isCSPReportRateLimited(clientIP)) {
      vercelOptimizer.cleanupTimer(requestId);
      return createJSONResponse({
        success: false,
        error: 'Too many CSP reports'
      }, 429);
    }

    // Validar request
    const validation = vercelOptimizer.validateRequest(request);
    if (!validation.valid) {
      vercelOptimizer.cleanupTimer(requestId);
      return createJSONResponse({
        success: false,
        error: 'Invalid request'
      }, 413);
    }

    // Procesar reporte CSP
    const cspReport = await request.json();

    // Registrar violación de CSP como patrón de ataque potencial
    recordAttackPattern('CSP_VIOLATION');

    // Log para análisis (solo en desarrollo)
    if (process.env.NODE_ENV !== 'production') {
      console.log('CSP Violation Report:', {
        ip: clientIP,
        timestamp: Date.now(),
        report: cspReport
      });
    }

    vercelOptimizer.cleanupTimer(requestId);
    return createJSONResponse({ success: true }, 204);

  } catch (error) {
    vercelOptimizer.cleanupTimer(requestId);
    return createJSONResponse({
      success: false,
      error: 'Failed to process CSP report'
    }, 500);
  }
};

// Limpiar reportes antiguos cada 30 minutos
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of cspReports.entries()) {
    if (now - data.lastReport > CSP_WINDOW) {
      cspReports.delete(ip);
    }
  }
}, 30 * 60 * 1000);
