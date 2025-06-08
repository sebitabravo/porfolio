import type { APIRoute } from 'astro';
import { authenticateUser } from '../../utils/authService';
import { createErrorResponse, createSuccessResponse } from '../../utils/responseUtils';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return createErrorResponse('Password es requerida', 400);
    }

    const result = authenticateUser(password);

    if (result.success) {
      return createSuccessResponse({ token: result.token });
    } else {
      return createErrorResponse(result.error!, 401);
    }
  } catch (error) {
    return createErrorResponse('Error procesando la solicitud', 500);
  }
};
