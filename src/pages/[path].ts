import type { APIRoute } from 'astro';
import { findLinkByShortCode, findLinkByCustomPath } from '../utils/linkShortener';

export const prerender = false;

export const GET: APIRoute = async ({ params, url }) => {
  try {
    const { path } = params;
    const baseUrl = url.origin;

    if (!path) {
      return Response.redirect(`${baseUrl}/404`, 302);
    }

    // Verificar si es una ruta reservada (evitar conflictos con páginas existentes)
    const reservedPaths = ['blog', 'shortcut', 'api', '404'];
    if (reservedPaths.includes(path)) {
      return Response.redirect(`${baseUrl}/404`, 302);
    }

    const link = findLinkByShortCode(path) || findLinkByCustomPath(path);

    if (!link) {
      return Response.redirect(`${baseUrl}/404`, 302);
    }

    // Redireccionar al URL original
    return new Response(null, {
      status: 302,
      headers: {
        Location: link.originalUrl,
      },
    });
  } catch (error) {
    // En caso de error, redirigir a 404
    const baseUrl = new URL('http://localhost:4321'); // Fallback URL
    return Response.redirect(`${baseUrl.origin}/404`, 302);
  }
};
