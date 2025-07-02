import type { APIRoute } from 'astro';
import { createShortLink } from '../../utils/linkShortener';
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

    // Validar estructura del body
    if (!body || typeof body !== 'object') {
      return createErrorResponse('Cuerpo de la solicitud inválido', 400);
    }

    const { url, customPath } = body;

    // Validaciones más estrictas
    if (!url || typeof url !== 'string') {
      return createErrorResponse('URL es requerida y debe ser una cadena de texto', 400);
    }

    if (!customPath || typeof customPath !== 'string') {
      return createErrorResponse('Ruta personalizada es requerida y debe ser una cadena de texto', 400);
    }

    // Límites de longitud
    if (url.length > 2048) {
      return createErrorResponse('URL demasiado larga (máximo 2048 caracteres)', 400);
    }

    if (customPath.length > 100) {
      return createErrorResponse('Ruta personalizada demasiado larga (máximo 100 caracteres)', 400);
    }

    const result = createShortLink({ url, customPath });

    if (result.success) {
      return createSuccessResponse({
        data: {
          shortUrl: result.shortUrl,
          shortCode: result.shortCode
        }
      });
    } else {
      return createErrorResponse(result.error!, 400);
    }
  } catch (error) {
    // Log del error para debugging
    console.error('Error en acortamiento:', error instanceof Error ? error.message : 'Error desconocido');
    return createErrorResponse('Error procesando la solicitud', 500);
  }
};
