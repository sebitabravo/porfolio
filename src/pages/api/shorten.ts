import type { APIRoute } from 'astro';
import { createShortLink } from '../../utils/linkShortener';
import { createErrorResponse, createSuccessResponse } from '../../utils/responseUtils';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const result = createShortLink(body);

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
    return createErrorResponse('Error procesando la solicitud', 500);
  }
};
