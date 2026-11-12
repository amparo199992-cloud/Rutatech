import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { config } from "../config.js";
import { prisma } from "../db.js";
import { publicUser } from "../lib/gamification.js";
import { badRequest, unauthorized } from "../lib/errors.js";
import { sendPasswordResetEmail } from "../lib/mailer.js";
import { authOptional, clearSessionCookie, setSessionCookie, signSession } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Demasiados intentos. Espera unos minutos y vuelve a intentarlo." },
});

export const passwordSchema = z
  .string({ error: "Escribe una contraseña." })
  .min(8, "La contraseña debe tener al menos 8 caracteres.")
  .max(100, "La contraseña es demasiado larga.")
  .regex(/[A-Za-zÁÉÍÓÚáéíóúÑñ]/, "Incluye al menos una letra.")
  .regex(/\d/, "Incluye al menos un número.");

const emailSchema = z
  .string({ error: "Escribe tu correo." })
  .trim()
  .toLowerCase()
  .pipe(z.email("Escribe un correo válido, por ejemplo nombre@correo.com."));

const registerSchema = z.object({
  name: z.string({ error: "Escribe tu nombre." }).trim().min(2, "Tu nombre debe tener al menos 2 letras.").max(80),
  email: emailSchema,
  password: passwordSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string({ error: "Escribe tu contraseña." }).min(1, "Escribe tu contraseña."),
});

router.post("/register", authLimiter, validate(registerSchema), async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw badRequest("Ya existe una cuenta con ese correo.", { email: "Este correo ya está registrado. ¿Quieres iniciar sesión?" });

  const user = await prisma.user.create({
    data: { name, email, passwordHash: await bcrypt.hash(password, 12) },
  });
  await prisma.activity.create({ data: { userId: user.id, type: "account", message: "Creaste tu cuenta en RutaTech. ¡Bienvenido!" } });
  setSessionCookie(res, signSession(user));
  res.status(201).json({ user: publicUser(user) });
});

router.post("/login", authLimiter, validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  // Mismo mensaje para correo o contraseña incorrectos (no revela qué cuentas existen).
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw unauthorized("Correo o contraseña incorrectos.");
  }
  setSessionCookie(res, signSession(user));
  res.json({ user: publicUser(user) });
});

router.post("/logout", (_req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

// Devuelve el usuario de la sesión o null (los visitantes no reciben un error).
router.get("/me", authOptional, async (req, res) => {
  const user = req.userId ? await prisma.user.findUnique({ where: { id: req.userId } }) : null;
  if (req.userId && !user) clearSessionCookie(res);
  res.json({ user: user ? publicUser(user) : null });
});

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

router.post("/forgot-password", authLimiter, validate(z.object({ email: emailSchema })), async (req, res) => {
  const user = await prisma.user.findUnique({ where: { email: req.body.email } });
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
    });
    await sendPasswordResetEmail(user.email, user.name, `${config.clientUrl}/restablecer?token=${token}`);
  }
  // Siempre la misma respuesta, exista o no la cuenta.
  res.json({ ok: true, message: "Si el correo está registrado, te enviamos un enlace para restablecer la contraseña." });
});

const resetSchema = z.object({
  token: z.string().min(20, "El enlace no es válido."),
  password: passwordSchema,
});

router.post("/reset-password", authLimiter, validate(resetSchema), async (req, res) => {
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashToken(req.body.token) } });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    throw badRequest("El enlace venció o ya se usó. Solicita uno nuevo.");
  }
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash: await bcrypt.hash(req.body.password, 12) } }),
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);
  res.json({ ok: true, message: "Tu contraseña se actualizó. Ya puedes iniciar sesión." });
});

export default router;
