import type { ShortenedLink, CreateLinkRequest, CreateLinkResponse } from './types.js';
import { loadLinks, addLink, findLinkByCustomPath } from './dataAccess.js';
import { generateUniqueShortCode } from './shortCodeGenerator.js';
import { isValidUrl, isValidCustomPath, sanitizeUrl } from './urlValidator.js';
import { CONFIG } from '../config.js';

export function createShortLink(request: CreateLinkRequest): CreateLinkResponse {
  const { url, customPath } = request;

  // Validar URL
  const sanitizedUrl = sanitizeUrl(url);
  if (!isValidUrl(sanitizedUrl)) {
    return { success: false, error: 'URL inválida' };
  }

  // Validar que customPath sea obligatorio
  if (!customPath || !customPath.trim()) {
    return { success: false, error: 'La ruta personalizada es obligatoria' };
  }

  // Validar custom path
  if (!isValidCustomPath(customPath)) {
    return { success: false, error: 'Path personalizado inválido' };
  }

  // Verificar que el custom path no esté reservado
  if (CONFIG.RESERVED_PATHS.includes(customPath.toLowerCase())) {
    return { success: false, error: 'Path reservado, elige otro' };
  }

  // Verificar que el custom path no exista
  if (findLinkByCustomPath(customPath)) {
    return { success: false, error: 'Path ya existe, elige otro' };
  }

  // Generar short code único
  const existingLinks = loadLinks();
  const existingCodes = existingLinks.map(link => link.shortCode);
  const shortCode = generateUniqueShortCode(existingCodes);

  // Crear el link
  const newLink: ShortenedLink = {
    id: `${Date.now()}-${shortCode}`,
    originalUrl: sanitizedUrl,
    shortCode,
    customPath,
    createdAt: new Date().toISOString()
  };

  // Guardar el link
  addLink(newLink);

  // Construir URL corta usando el custom path
  const shortUrl = `${getBaseUrl()}/${customPath}`;

  return {
    success: true,
    shortUrl,
    shortCode
  };
}

function getBaseUrl(): string {
  // Si hay un dominio base configurado, usarlo
  if (CONFIG.BASE_DOMAIN) {
    return CONFIG.BASE_DOMAIN;
  }

  // En desarrollo usar localhost, en producción usar el dominio real
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:4321';
  }

  // Fallback para producción cuando no está configurado BASE_DOMAIN
  return 'https://tu-proyecto.vercel.app'; // Se recomienda configurar BASE_DOMAIN
}
