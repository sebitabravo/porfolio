export const prerender = false;

import type { APIRoute } from 'astro';
import { getDetailedStats } from '../../utils/linkManager';
import { createErrorResponse, createSuccessResponse } from '../../utils/responseUtils';

export const GET: APIRoute = async () => {
  try {
    const stats = await getDetailedStats();
    return createSuccessResponse({ data: stats });
  } catch (error) {
    return createErrorResponse('Error interno del servidor', 500);
  }
};
