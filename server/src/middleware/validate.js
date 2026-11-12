import { badRequest } from "../lib/errors.js";

// Valida req.body con un esquema zod y deja el resultado limpio en req.body.
export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body ?? {});
    if (!result.success) {
      const fields = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".") || "_";
        if (!fields[key]) fields[key] = issue.message;
      }
      return next(badRequest("Revisa los datos del formulario.", fields));
    }
    req.body = result.data;
    next();
  };
}
