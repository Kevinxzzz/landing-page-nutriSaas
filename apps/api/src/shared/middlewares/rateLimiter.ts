import rateLimit from "express-rate-limit";

/**
 * Rate limiter para endpoints públicos sensíveis (30 req/min por IP).
 * Aplicar apenas em rotas sem authMiddleware.
 */
export const publicRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30,
  standardHeaders: true, // Retorna headers RateLimit-* (RFC 6585)
  legacyHeaders: false,
  message: {
    success: false,
    message: "Muitas requisições. Tente novamente em alguns instantes.",
  },
});
