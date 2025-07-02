export function isValidUrl(url: string): boolean {
  try {
    // Verificar que la URL no esté vacía o sea solo espacios
    if (!url || !url.trim()) {
      return false;
    }

    const urlObj = new URL(url);

    // Verificar protocolo
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return false;
    }

    // Verificar que tenga un hostname válido
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      return false;
    }

    // Bloquear IPs locales y privadas por seguridad
    const hostname = urlObj.hostname.toLowerCase();
    const blockedPatterns = [
      /^localhost$/,
      /^127\./,
      /^192\.168\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^0\./,
      /^::1$/,
      /^fc00:/,
      /^fe80:/
    ];

    return !blockedPatterns.some(pattern => pattern.test(hostname));
  } catch {
    return false;
  }
}

export function isValidCustomPath(path: string): boolean {
  if (!path) return false; // Custom path es requerido ahora

  // Verificar longitud
  if (path.length < 2 || path.length > 50) {
    return false;
  }

  // Verificar caracteres válidos (letras, números, guiones y guiones bajos)
  const validPattern = /^[a-zA-Z0-9-_]+$/;

  // No debe empezar o terminar con guión
  if (path.startsWith('-') || path.endsWith('-')) {
    return false;
  }

  return validPattern.test(path);
}

export function sanitizeUrl(url: string): string {
  // Limpiar espacios
  url = url.trim();

  // Añadir protocolo si no está presente
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }

  return url;
}
