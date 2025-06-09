import { loadLinks, saveLinks, type ShortenedLink } from './linkShortener.js';

// Limpiar links viejos (más de X días)
export async function cleanOldLinks(daysOld: number = 30): Promise<number> {
  const links = loadLinks();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const activeLinks = links.filter(link => {
    const linkDate = new Date(link.createdAt);
    return linkDate > cutoffDate;
  });

  const removedCount = links.length - activeLinks.length;

  if (removedCount > 0) {
    saveLinks(activeLinks);
  }

  return removedCount;
}

// Obtener links más recientes
export async function getTopLinks(limit: number = 10): Promise<ShortenedLink[]> {
  const links = loadLinks();
  return links
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

// Obtener estadísticas detalladas
export async function getDetailedStats() {
  const links = loadLinks();

  const totalLinks = links.length;

  // Links por mes
  const linksByMonth = links.reduce((acc, link) => {
    const month = new Date(link.createdAt).toISOString().slice(0, 7); // YYYY-MM
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Links más recientes
  const topLinks = await getTopLinks(5);

  // Links creados hoy
  const today = new Date().toISOString().slice(0, 10);
  const linksToday = links.filter(link =>
    link.createdAt.slice(0, 10) === today
  ).length;

  return {
    totalLinks,
    linksByMonth,
    topLinks,
    linksToday,
  };
}

// Exportar datos para backup
export async function exportData(): Promise<string> {
  const links = loadLinks();
  const stats = await getDetailedStats();

  return JSON.stringify({
    exportDate: new Date().toISOString(),
    links,
    stats
  }, null, 2);
}

// Importar datos desde backup
export async function importData(jsonData: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonData);
    if (data.links && Array.isArray(data.links)) {
      saveLinks(data.links);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
