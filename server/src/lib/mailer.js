// Envío de correos. Orden de preferencia:
// 1. Resend (API por HTTPS): funciona aunque el proveedor bloquee los puertos SMTP.
// 2. SMTP clásico con nodemailer.
// 3. Sin configuración (desarrollo): el enlace se muestra en la consola.
import nodemailer from "nodemailer";
import { config } from "../config.js";

const resendKey = process.env.RESEND_API_KEY;

let transporter = null;
if (!resendKey && config.smtp.host) {
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined,
  });
}

async function sendWithResend({ to, subject, text }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: config.smtp.from, to: [to], subject, text }),
  });
  if (!response.ok) {
    throw new Error(`Resend respondió ${response.status}: ${await response.text()}`);
  }
}

export async function sendPasswordResetEmail(to, name, link) {
  const subject = "Restablece tu contraseña de RutaTech";
  const text = `Hola ${name}:\n\nRecibimos una solicitud para restablecer tu contraseña.\nAbre este enlace (válido por 1 hora):\n${link}\n\nSi no fuiste tú, ignora este mensaje: tu contraseña no cambiará.\n\nEquipo RutaTech`;

  try {
    if (resendKey) return await sendWithResend({ to, subject, text });
    if (transporter) return await transporter.sendMail({ from: config.smtp.from, to, subject, text });
  } catch (err) {
    // No revelamos el fallo al usuario (la respuesta es la misma exista o no la cuenta), pero sí lo registramos.
    console.error("No se pudo enviar el correo de recuperación:", err.message);
    return;
  }
  // Modo desarrollo: sin servicio de correo, mostramos el enlace en la consola.
  console.log(`\n📧 [Correo simulado] Para: ${to}\n   ${subject}\n   Enlace: ${link}\n`);
}
