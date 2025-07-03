import type { MiddlewareHandler } from 'astro';
import { getClientIP, isGloballyRateLimited } from './utils/authService';
import { recordRequest, recordAttackPattern, isSuspiciousIP } from './utils/securityMonitor';
import { vercelOptimizer, VERCEL_CONFIG } from './utils/vercelOptimizer';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const url = new URL(context.request.url);
  
  // Skip middleware for all prerendered static pages to avoid headers warnings
  const isPrerenderedPage =
    url.pathname === '/redes' ||
    url.pathname === '/' ||
    url.pathname.startsWith('/blog');

  // Optimización: Skip middleware para assets estáticos
  const isStaticAsset =
    url.pathname.startsWith('/_astro/') ||
    url.pathname.startsWith('/favicon') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.avif') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff');

  if (isStaticAsset) {
    const response = await next();
    // Solo añadir cache headers para assets estáticos
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('X-Content-Type-Options', 'nosniff');
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }

  // Skip middleware para páginas estáticas prerendered
  if (isPrerenderedPage) {
    return next();
  }

  // Solo aplicar middleware completo a rutas dinámicas y APIs
  const isDynamicRoute =
    url.pathname.startsWith('/api/') ||
    url.pathname === '/shortcut' ||
    (url.pathname !== '/' &&
     !url.pathname.startsWith('/blog') &&
     !url.pathname.includes('.'));

  if (!isDynamicRoute) {
    return next();
  }

  // Generar ID único para el request para tracking
  const requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  vercelOptimizer.startExecutionTimer(requestId);

  // Validar request para Vercel limits
  const validation = vercelOptimizer.validateRequest(context.request);
  if (!validation.valid) {
    vercelOptimizer.cleanupTimer(requestId);
    return new Response(`Request Invalid: ${validation.reason}`, {
      status: 413,
      headers: { 'X-Vercel-Error': 'payload-limit' }
    });
  }

  // Rate limiting global ANTES de procesar cualquier request
  const clientIP = getClientIP(context.request);

  // Verificar si la IP es sospechosa
  if (isSuspiciousIP(clientIP)) {
    recordRequest(clientIP, true);
    recordAttackPattern('SUSPICIOUS_IP_ACCESS');
    vercelOptimizer.cleanupTimer(requestId);
    return new Response('Access Denied - Suspicious Activity Detected', {
      status: 403,
      headers: {
        'X-Security-Block': 'suspicious-ip',
        'X-Vercel-Protected': 'true'
      }
    });
  }

  // Verificar si la IP está globally rate limited
  if (isGloballyRateLimited(clientIP)) {
    recordRequest(clientIP, true);
    recordAttackPattern('GLOBAL_RATE_LIMIT_EXCEEDED');
    vercelOptimizer.cleanupTimer(requestId);
    return new Response('Too Many Requests - Global Rate Limit Exceeded', {
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Limit': VERCEL_CONFIG.rateLimits.global.requestsPerMinute.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': Math.ceil(Date.now() / 1000 + 60).toString(),
        'X-Vercel-Protected': 'true'
      }
    });
  }

  // Validar tamaño del request para prevenir memory exhaustion
  // Solo si tenemos headers disponibles (no en prerender)
  const contentLength = context.request.headers?.get('content-length');
  const maxPayload = VERCEL_CONFIG.rateLimits.memory.maxPayloadSize;
  if (contentLength && parseInt(contentLength) > maxPayload) {
    recordRequest(clientIP, true);
    recordAttackPattern('PAYLOAD_TOO_LARGE');
    vercelOptimizer.cleanupTimer(requestId);
    return new Response('Payload Too Large', {
      status: 413,
      headers: { 'X-Vercel-Error': 'payload-exceeded' }
    });
  }

  // Registrar request normal
  recordRequest(clientIP, false);

  // Verificar tiempo de ejecución durante el proceso
  const timeCheck = vercelOptimizer.checkExecutionTime(requestId);
  if (!timeCheck.withinLimit) {
    vercelOptimizer.cleanupTimer(requestId);
    return new Response('Request Timeout - Execution time exceeded', {
      status: 408,
      headers: { 'X-Vercel-Error': 'timeout' }
    });
  }

  // Ejecutar la solicitud
  const response = await next();

  // Crear headers combinados para evitar errores de inmutabilidad
  const headers = new Headers();

  // Copiar headers existentes de la respuesta
  response.headers.forEach((value, key) => {
    // Excluir headers que queremos eliminar
    if (key.toLowerCase() !== 'server' && key.toLowerCase() !== 'x-powered-by') {
      headers.set(key, value);
    }
  });

  // Añadir headers de seguridad optimizados para Vercel
  const optimizedHeaders = vercelOptimizer.getOptimizedHeaders();
  Object.entries(optimizedHeaders).forEach(([key, value]) => {
    headers.set(key, value as string);
  });

  // CSP (Content Security Policy) optimizado para Vercel
  const cspConfig = VERCEL_CONFIG.cspConfig;
  const csp = Object.entries(cspConfig.directives)
    .map(([directive, sources]) => {
      const directiveName = directive.replace(/([A-Z])/g, '-$1').toLowerCase();
      const sourceList = (sources as string[]).join(' ');
      return `${directiveName} ${sourceList}`;
    })
    .join('; ');

  headers.set('Content-Security-Policy', csp);

  // Añadir información de optimización de Vercel
  headers.set('X-Vercel-Execution-Time', timeCheck.elapsedMs.toString());

  // Limpiar timer
  vercelOptimizer.cleanupTimer(requestId);

  // Crear nueva respuesta con headers modificados
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
};
