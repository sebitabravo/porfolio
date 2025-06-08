export const prerender = false;

import type { APIRoute } from 'astro';
import { loadLinks, deleteLink } from '../../utils/linkShortener';
import { createErrorResponse, createSuccessResponse } from '../../utils/responseUtils';

export const GET: APIRoute = async () => {
  try {
    const links = await loadLinks();
    return createSuccessResponse({ data: links });
  } catch (error) {
    return createErrorResponse('Error interno del servidor', 500);
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const { id } = await request.json();

    if (!id) {
      return createErrorResponse('ID es requerido', 400);
    }

    const deleted = await deleteLink(id);

    if (deleted) {
      return createSuccessResponse({ message: 'Link eliminado correctamente' });
    } else {
      return createErrorResponse('Link no encontrado', 404);
    }
  } catch (error) {
    return createErrorResponse('Error interno del servidor', 500);
  }
};
