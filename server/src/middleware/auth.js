import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { prisma } from "../db.js";
import { forbidden, unauthorized } from "../lib/errors.js";

export const COOKIE_NAME = "rutatech_session";

export function signSession(user) {
  return jwt.sign({ sub: String(user.id), role: user.role }, config.jwtSecret, {
    expiresIn: `${config.jwtExpiresDays}d`,
  });
}

export function setSessionCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: config.isProd || config.cookieSameSite === "none",
    sameSite: config.cookieSameSite,
    maxAge: config.jwtExpiresDays * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: config.isProd || config.cookieSameSite === "none",
    sameSite: config.cookieSameSite,
    path: "/",
  });
}

function readToken(req) {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  return req.cookies?.[COOKIE_NAME];
}

// Lee la sesión si existe, pero no obliga a tenerla (páginas públicas).
export function authOptional(req, _res, next) {
  const token = readToken(req);
  if (token) {
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      req.userId = Number(payload.sub);
    } catch {
      // Token vencido o inválido: se trata como visitante.
    }
  }
  next();
}

export function requireAuth(req, res, next) {
  authOptional(req, res, () => {
    if (!req.userId) return next(unauthorized());
    next();
  });
}

// El rol se consulta en la base de datos en cada petición de administración,
// así un cambio de rol tiene efecto inmediato.
export function requireAdmin(req, res, next) {
  requireAuth(req, res, async (err) => {
    if (err) return next(err);
    const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { role: true } });
    if (user?.role !== "ADMIN") return next(forbidden());
    next();
  });
}
