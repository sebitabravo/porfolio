import type { APIRoute } from 'astro';
import { authenticateUser } from '../../utils/authService';
import { createErrorResponse, createSuccessResponse } from '../../utils/responseUtils';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Validar Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return createErrorResponse('Content-Type debe ser application/json', 400);
    }

    const body = await request.json();
    const { password } = body;

    // Validaciones más estrictas
    if (!password || typeof password !== 'string') {
      return createErrorResponse('Password es requerida y debe ser una cadena de texto', 400);
    }

    if (password.length > 256) {
      return createErrorResponse('Password demasiado largo', 400);
    }

    const result = authenticateUser(password);

    if (result.success) {
      return createSuccessResponse({ token: result.token });
    } else {
      return createErrorResponse(result.error!, 401);
    }
  } catch (error) {
    // Log del error para debugging (sin exponer información sensible)
    console.error('Error en autenticación:', error instanceof Error ? error.message : 'Error desconocido');
    return createErrorResponse('Error procesando la solicitud', 500);
  }
};
