// Utilidades para respuestas HTTP estándar
export function createJSONResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function createErrorResponse(error: string, status: number = 400) {
  return createJSONResponse({ error }, status);
}

export function createSuccessResponse(data: any, status: number = 200) {
  return createJSONResponse({ success: true, ...data }, status);
}
