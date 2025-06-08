// Re-exports del servicio de acortamiento de enlaces
export { createShortLink } from './linkShortener/linkShortenerService.js';
export {
  loadLinks,
  saveLinks,
  findLinkByShortCode,
  findLinkByCustomPath,
  addLink,
  deleteLink
} from './linkShortener/dataAccess.js';
export { generateShortCode, generateUniqueShortCode } from './linkShortener/shortCodeGenerator.js';
export { isValidUrl, isValidCustomPath, sanitizeUrl } from './linkShortener/urlValidator.js';

// Re-export tipos
export type {
  ShortenedLink,
  CreateLinkRequest,
  CreateLinkResponse,
  LinkStats
} from './linkShortener/types.js';
