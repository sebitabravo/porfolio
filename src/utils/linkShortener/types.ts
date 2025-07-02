export interface ShortenedLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  customPath: string; // Obligatorio
  createdAt: string;
  clicks?: number; // Contador de clicks (opcional para retrocompatibilidad)
  lastAccessed?: string; // Última vez accedido (opcional)
}

export interface CreateLinkRequest {
  url: string;
  customPath: string; // Obligatorio
}

export interface CreateLinkResponse {
  success: boolean;
  shortUrl?: string;
  shortCode?: string;
  error?: string;
}

export interface LinkStats {
  totalLinks: number;
  recentLinks: ShortenedLink[];
  totalClicks?: number;
}

// Tipos para validación
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Tipos para respuestas de API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// Tipos para configuración
export interface SecurityConfig {
  maxUrlLength: number;
  maxCustomPathLength: number;
  allowedProtocols: string[];
  blockedDomains: string[];
}
