export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isValidCustomPath(path: string): boolean {
  if (!path) return true; // Custom path es opcional

  // Verificar longitud
  if (path.length < 2 || path.length > 50) {
    return false;
  }

  // Verificar caracteres válidos (letras, números, guiones y guiones bajos)
  const validPattern = /^[a-zA-Z0-9-_]+$/;
  return validPattern.test(path);
}

export function sanitizeUrl(url: string): string {
  // Añadir protocolo si no está presente
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
}
