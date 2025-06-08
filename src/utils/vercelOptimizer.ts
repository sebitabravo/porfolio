export const VERCEL_CONFIG = {
  rateLimits: {
    global: {
      requestsPerMinute: 100
    },
    memory: {
      maxPayloadSize: 4.5 * 1024 * 1024 // 4.5MB
    }
  },
  cspConfig: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  }
};

interface ValidationResult {
  valid: boolean;
  reason?: string;
}

interface TimeCheck {
  withinLimit: boolean;
  elapsedMs: number;
}

class VercelOptimizer {
  private timers = new Map<string, number>();

  startExecutionTimer(requestId: string): void {
    this.timers.set(requestId, Date.now());
  }

  checkExecutionTime(requestId: string, maxMs: number = 9000): TimeCheck {
    const startTime = this.timers.get(requestId);
    if (!startTime) {
      return { withinLimit: true, elapsedMs: 0 };
    }

    const elapsedMs = Date.now() - startTime;
    return {
      withinLimit: elapsedMs < maxMs,
      elapsedMs
    };
  }

  cleanupTimer(requestId: string): void {
    this.timers.delete(requestId);
  }

  validateRequest(request: Request): ValidationResult {
    const contentLength = request.headers.get('content-length');
    const maxSize = VERCEL_CONFIG.rateLimits.memory.maxPayloadSize;

    if (contentLength && parseInt(contentLength) > maxSize) {
      return {
        valid: false,
        reason: `Payload exceeds ${maxSize} bytes`
      };
    }

    return { valid: true };
  }

  getOptimizedHeaders(): Record<string, string> {
    return {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    };
  }
}

export const vercelOptimizer = new VercelOptimizer();
