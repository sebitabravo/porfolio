import type { APIRoute } from 'astro';
import { authenticateUser } from '../../utils/authService';
import { generateSecurityReport } from '../../utils/securityMonitor';
import { createSuccessResponse, createErrorResponse } from '../../utils/responseUtils';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    // Obtener password desde query params o headers para autenticación
    const url = new URL(request.url);
    const password = url.searchParams.get('password') || request.headers.get('authorization');

    if (!password) {
      return createErrorResponse('Autenticación requerida', 401);
    }

    const authResult = authenticateUser(password);
    if (!authResult.success) {
      return createErrorResponse(authResult.error!, 401);
    }

    const securityReport = generateSecurityReport();

    return createSuccessResponse({
      report: securityReport,
      timestamp: new Date().toISOString()
        });
  } catch (error) {
    return createErrorResponse('Error generating security report', 500);
  }
};
