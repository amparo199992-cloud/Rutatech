import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { badRequest, notFound } from "../lib/errors.js";
import { evaluateBadges, publicUser, recordActivity } from "../lib/gamification.js";
import { getUserProgress } from "../lib/progress.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { passwordSchema } from "./auth.js";

const router = Router();
router.use(requireAuth);

const profileSchema = z.object({
  name: z.string().trim().min(2, "Tu nombre debe tener al menos 2 letras.").max(80).optional(),
  bio: z.string().trim().max(400, "Máximo 400 caracteres.").optional(),
  goal: z.string().trim().max(160, "Máximo 160 caracteres.").optional(),
  weeklyHours: z.coerce.number().int().min(1, "Mínimo 1 hora.").max(60, "Máximo 60 horas.").optional(),
});

router.patch("/me", validate(profileSchema), async (req, res) => {
  const user = await prisma.user.update({ where: { id: req.userId }, data: req.body });
  res.json({ user: publicUser(user) });
});

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Escribe tu contraseña actual."),
  newPassword: passwordSchema,
});

router.post("/me/password", validate(passwordChangeSchema), async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!(await bcrypt.compare(req.body.currentPassword, user.passwordHash))) {
    throw badRequest("La contraseña actual no es correcta.", { currentPassword: "La contraseña actual no es correcta." });
  }
  await prisma.user.update({ where: { id: req.userId }, data: { passwordHash: await bcrypt.hash(req.body.newPassword, 12) } });
  res.json({ ok: true, message: "Contraseña actualizada." });
});

router.put("/me/specialization", validate(z.object({ slug: z.string().min(1) })), async (req, res) => {
  const spec = await prisma.specialization.findUnique({ where: { slug: req.body.slug } });
  if (!spec) throw notFound("Esa especialización no existe.");
  await prisma.user.update({ where: { id: req.userId }, data: { specializationSlug: spec.slug } });
  await recordActivity(req.userId, { type: "specialization", message: `Elegiste la especialización «${spec.title}»` });
  const progress = await getUserProgress(req.userId);
  const newBadges = await evaluateBadges(req.userId, progress);
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  res.json({ user: publicUser(user), newBadges });
});

export default router;
