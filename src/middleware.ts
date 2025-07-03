import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const url = new URL(context.request.url);
  
  // Completely bypass middleware for prerendered pages to prevent headers access
  if (
    url.pathname === '/' ||
    url.pathname === '/redes' || 
    url.pathname === '/blog' ||
    url.pathname.startsWith('/blog/') ||
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
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.html')
  ) {
    return next();
  }

  // Only apply middleware to API routes and /shortcut - no other routes
  if (url.pathname.startsWith('/api/') || url.pathname === '/shortcut') {
    // Dynamic import to avoid any initialization during prerendering
    const [
      { getClientIP, isGloballyRateLimited },
      { recordRequest, recordAttackPattern, isSuspiciousIP },
      { vercelOptimizer, VERCEL_CONFIG }
    ] = await Promise.all([
      import('./utils/authService'),
      import('./utils/securityMonitor'),
      import('./utils/vercelOptimizer')
    ]);

    const requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    vercelOptimizer.startExecutionTimer(requestId);

    const validation = vercelOptimizer.validateRequest(context.request);
    if (!validation.valid) {
      vercelOptimizer.cleanupTimer(requestId);
      return new Response(`Request Invalid: ${validation.reason}`, {
        status: 413,
        headers: { 'X-Vercel-Error': 'payload-limit' }
      });
    }

    const clientIP = getClientIP(context.request);

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

    recordRequest(clientIP, false);

    const timeCheck = vercelOptimizer.checkExecutionTime(requestId);
    if (!timeCheck.withinLimit) {
      vercelOptimizer.cleanupTimer(requestId);
      return new Response('Request Timeout - Execution time exceeded', {
        status: 408,
        headers: { 'X-Vercel-Error': 'timeout' }
      });
    }

    const response = await next();

    const headers = new Headers();
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'server' && key.toLowerCase() !== 'x-powered-by') {
        headers.set(key, value);
      }
    });

    const optimizedHeaders = vercelOptimizer.getOptimizedHeaders();
    Object.entries(optimizedHeaders).forEach(([key, value]) => {
      headers.set(key, value as string);
    });

    const cspConfig = VERCEL_CONFIG.cspConfig;
    const csp = Object.entries(cspConfig.directives)
      .map(([directive, sources]) => {
        const directiveName = directive.replace(/([A-Z])/g, '-$1').toLowerCase();
        const sourceList = (sources as string[]).join(' ');
        return `${directiveName} ${sourceList}`;
      })
      .join('; ');

    headers.set('Content-Security-Policy', csp);
    headers.set('X-Vercel-Execution-Time', timeCheck.elapsedMs.toString());

    vercelOptimizer.cleanupTimer(requestId);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers
    });
  }

  // For all other routes, pass through without any middleware processing
  return next();
};