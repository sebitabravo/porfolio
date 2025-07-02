// Utilidades para respuestas HTTP estándar
export function createJSONResponse(data: any, status: number = 200, additionalHeaders?: Record<string, string>) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    ...additionalHeaders
  };

  return new Response(JSON.stringify(data), {
    status,
    headers,
  });
}

export function createErrorResponse(error: string, status: number = 400, additionalHeaders?: Record<string, string>) {
  // Asegurar que el error sea una cadena válida
  const sanitizedError = typeof error === 'string' ? error : 'Error interno del servidor';

  return createJSONResponse({
    error: sanitizedError,
    success: false,
    timestamp: new Date().toISOString()
  }, status, additionalHeaders);
}

export function createSuccessResponse(data: any, status: number = 200, additionalHeaders?: Record<string, string>) {
  return createJSONResponse({
    success: true,
    timestamp: new Date().toISOString(),
    ...data
  }, status, additionalHeaders);
}
