import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// In-memory Rate Limiter storage
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const ipRequestCounts = new Map<string, RateLimitRecord>();

// Clean up stale rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRequestCounts.entries()) {
    if (now > record.resetTime) {
      ipRequestCounts.delete(ip);
    }
  }
}, 300000);

@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 1. HTTP Security Headers (OWASP Recommended)
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
      'Permissions-Policy',
      'geolocation=(self), microphone=(), camera=(), payment=()',
    );

    // 2. Rate Limiting per IP
    const clientIp =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      'unknown-client';

    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    
    // Strict limit for auth endpoints (brute force protection), higher limit for general API
    const isAuth = req.path.startsWith('/auth/login') || req.path.startsWith('/auth/register');
    const maxRequests = isAuth ? 25 : 300;

    let record = ipRequestCounts.get(clientIp);
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      ipRequestCounts.set(clientIp, record);
    } else {
      record.count++;
    }

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > maxRequests) {
      res.setHeader('Retry-After', Math.ceil((record.resetTime - now) / 1000));
      return res.status(HttpStatus.TOO_MANY_REQUESTS).json({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        error: 'Too Many Requests',
        message: 'Limite de requisições excedido. Tente novamente em instantes.',
      });
    }

    next();
  }
}
