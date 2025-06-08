export interface ShortenedLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  customPath: string; // Ahora es obligatorio
  createdAt: string;
}

export interface CreateLinkRequest {
  url: string;
  customPath: string; // Ahora es obligatorio
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
}
