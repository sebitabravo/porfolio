import fs from 'fs';
import path from 'path';
import type { ShortenedLink } from './types.js';

const DATA_FILE = path.join(process.cwd(), 'data', 'links.json');

export function loadLinks(): ShortenedLink[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading links:', error);
    return [];
  }
}

export function saveLinks(links: ShortenedLink[]): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(links, null, 2));
  } catch (error) {
    console.error('Error saving links:', error);
  }
}

export function findLinkByShortCode(shortCode: string): ShortenedLink | undefined {
  const links = loadLinks();
  return links.find(link => link.shortCode === shortCode);
}

export function findLinkByCustomPath(customPath: string): ShortenedLink | undefined {
  const links = loadLinks();
  return links.find(link => link.customPath === customPath);
}

export function addLink(link: ShortenedLink): void {
  const links = loadLinks();
  links.push(link);
  saveLinks(links);
}

export function deleteLink(id: string): boolean {
  const links = loadLinks();
  const initialLength = links.length;
  const filteredLinks = links.filter(link => link.id !== id);
  if (filteredLinks.length < initialLength) {
    saveLinks(filteredLinks);
    return true;
  }
  return false;
}
