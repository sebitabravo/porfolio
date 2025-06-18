export interface AttackMetrics {
  totalRequests: number;
  blockedRequests: number;
  suspiciousIPs: string[];
  attackPatterns: Record<string, number>;
  lastUpdated: string;
}

// Almacenamiento en memoria para métricas de seguridad
const securityData = {
  requests: new Map<string, { count: number; blocked: number; lastSeen: number }>(),
  attackPatterns: new Map<string, number>(),
  suspiciousIPs: new Set<string>()
};

export function recordRequest(ip: string, blocked: boolean = false): void {
  const current = securityData.requests.get(ip) || { count: 0, blocked: 0, lastSeen: Date.now() };
  current.count++;
  if (blocked) {
    current.blocked++;
  }
  current.lastSeen = Date.now();
  securityData.requests.set(ip, current);

  // Marcar como sospechosa si tiene muchos requests bloqueados
  if (current.blocked > 10) {
    securityData.suspiciousIPs.add(ip);
  }
}

export function recordAttackPattern(pattern: string): void {
  const current = securityData.attackPatterns.get(pattern) || 0;
  securityData.attackPatterns.set(pattern, current + 1);
}

export function isSuspiciousIP(ip: string): boolean {
  return securityData.suspiciousIPs.has(ip);
}

export function getSecurityMetrics(): AttackMetrics {
  let totalRequests = 0;
  let blockedRequests = 0;

  for (const data of securityData.requests.values()) {
    totalRequests += data.count;
    blockedRequests += data.blocked;
  }

  return {
    totalRequests,
    blockedRequests,
    suspiciousIPs: Array.from(securityData.suspiciousIPs),
    attackPatterns: Object.fromEntries(securityData.attackPatterns),
    lastUpdated: new Date().toISOString()
  };
}

// Crear una instancia singleton para compatibilidad
export const securityMonitor = {
  recordRequest,
  recordAttackPattern,
  isSuspiciousIP,
  getMetrics: getSecurityMetrics
};
