export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const badRequest = (msg, details) => new HttpError(400, msg, details);
export const unauthorized = (msg = "Necesitas iniciar sesión para continuar.") => new HttpError(401, msg);
export const forbidden = (msg = "No tienes permiso para realizar esta acción.") => new HttpError(403, msg);
export const notFound = (msg = "No encontramos lo que buscas.") => new HttpError(404, msg);
export const conflict = (msg) => new HttpError(409, msg);
