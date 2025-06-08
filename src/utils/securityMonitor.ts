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

export function generateSecurityReport(): string {
  const metrics = getSecurityMetrics();

  return `
=== REPORTE DE SEGURIDAD ===
Total de Requests: ${metrics.totalRequests}
Requests Bloqueados: ${metrics.blockedRequests}
IPs Sospechosas: ${metrics.suspiciousIPs.length}
Patrones de Ataque Detectados: ${Object.keys(metrics.attackPatterns).length}

Patrones de Ataque:
${Object.entries(metrics.attackPatterns)
  .map(([pattern, count]) => `- ${pattern}: ${count}`)
  .join('\n')}

IPs Sospechosas:
${metrics.suspiciousIPs.map(ip => `- ${ip}`).join('\n')}

Generado: ${metrics.lastUpdated}
`;
}

// Crear una instancia singleton para compatibilidad
export const securityMonitor = {
  recordRequest,
  recordAttackPattern,
  isSuspiciousIP,
  getMetrics: getSecurityMetrics,
  generateSecurityReport
};
