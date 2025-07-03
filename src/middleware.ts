import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const url = new URL(context.request.url);
  
  // Skip middleware completely for static assets and prerendered pages
  if (
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
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.ico')
  ) {
    return next();
  }

  // For now, simplify middleware to avoid deployment issues
  // Only basic processing for API routes
  if (url.pathname.startsWith('/api/')) {
    const response = await next();
    
    // Add basic security headers
    const headers = new Headers(response.headers);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers
    });
  }

  // Pass through all other requests without modification
  return next();
};