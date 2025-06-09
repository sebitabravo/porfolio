export const prerender = false;

import type { APIRoute } from 'astro';
import { loadLinks } from '../../utils/linkShortener';
import { createErrorResponse, createSuccessResponse } from '../../utils/responseUtils';

export const GET: APIRoute = async () => {
  try {
    const links = loadLinks();

    const totalLinks = links.length;

    return createSuccessResponse({
      data: {
        totalLinks,
      }
    });
  } catch (error) {
    return createErrorResponse('Error interno del servidor', 500);
  }
};
