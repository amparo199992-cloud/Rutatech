import { Link } from "react-router";
import { LEVEL_LABEL } from "../lib/stages.js";

const VARIANTS = {
  primary: "bg-cobalt-500 text-white hover:bg-cobalt-600 disabled:bg-cobalt-300",
  secondary:
    "border-2 border-ink/15 bg-white text-ink hover:border-cobalt-500 hover:text-cobalt-600 dark:border-white/15 dark:bg-night-2 dark:text-slate-100 dark:hover:border-cobalt-300",
  ghost: "text-cobalt-600 hover:bg-cobalt-50 dark:text-cobalt-300 dark:hover:bg-night-2",
  success: "bg-mint-700 text-white hover:bg-mint-500",
  danger: "bg-red-700 text-white hover:bg-red-800",
};
const SIZES = {
  md: "min-h-12 px-5 text-base",
  lg: "min-h-14 px-7 text-lg",
  sm: "min-h-10 px-4 text-sm",
};

export function buttonClass(variant = "primary", size = "md", extra = "") {
  return `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${extra}`;
}

export function Button({ variant, size, className = "", loading, children, ...props }) {
  return (
    <button className={buttonClass(variant, size, className)} disabled={loading || props.disabled} {...props}>
      {loading && <Spinner small />}
      {children}
    </button>
  );
}

export function ButtonLink({ to, variant, size, className = "", children, ...props }) {
  return (
    <Link to={to} className={buttonClass(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}

export function Container({ className = "", children }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function ProgressBar({ value = 0, label, color = "var(--color-cobalt-500)", size = "md" }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={`w-full overflow-hidden rounded-full bg-ink/10 dark:bg-white/10 ${size === "sm" ? "h-1.5" : "h-2.5"}`}
    >
      <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${v}%`, background: color }} />
    </div>
  );
}

export function Spinner({ small }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent ${small ? "h-4 w-4" : "h-8 w-8"}`}
    />
  );
}

export function Loading({ label = "Cargando…" }) {
  return (
    <div role="status" className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-cobalt-500">
      <Spinner />
      <span className="text-ink/70 dark:text-slate-300">{label}</span>
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  const notFound = error?.status === 404;
  return (
    <div role="alert" className="mx-auto my-16 max-w-lg rounded-2xl border-2 border-red-200 bg-white p-6 text-center dark:border-red-900 dark:bg-night-2">
      <p className="font-display text-xl font-bold">{notFound ? "No encontramos esta página" : "No pudimos cargar esto"}</p>
      <p className="mt-2 text-ink/75 dark:text-slate-300">{error?.message}</p>
      <div className="mt-5 flex justify-center gap-3">
        {onRetry && !notFound && <Button onClick={onRetry}>Intentar de nuevo</Button>}
        <ButtonLink to="/ruta" variant="secondary">
          Ir a la ruta
        </ButtonLink>
      </div>
    </div>
  );
}

export function Field({ label, error, hint, id, as = "input", className = "", ...props }) {
  const Tag = as;
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block font-semibold">
        {label}
      </label>
      <Tag
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 focus:border-cobalt-500 focus:outline-none dark:bg-night-2 dark:text-slate-100 dark:placeholder:text-slate-500 ${
          error ? "border-red-600" : "border-ink/15 dark:border-white/15"
        } ${as === "textarea" ? "min-h-28" : "min-h-12"}`}
        {...props}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-ink/65 dark:text-slate-400">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm font-medium text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormError({ message }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 font-medium text-red-800 dark:bg-red-950 dark:text-red-200">
      {message}
    </p>
  );
}

const LEVEL_STYLE = {
  principiante: "bg-mint-50 text-mint-700 dark:bg-mint-700/20 dark:text-mint-500",
  intermedio: "bg-signal-50 text-[#8a5a00] dark:bg-signal/15 dark:text-signal",
  avanzado: "bg-cobalt-50 text-cobalt-700 dark:bg-cobalt-500/20 dark:text-cobalt-300",
};

export function LevelTag({ level }) {
  return <span className={`inline-block rounded-md px-2 py-0.5 text-sm font-semibold ${LEVEL_STYLE[level] ?? LEVEL_STYLE.principiante}`}>{LEVEL_LABEL[level] ?? level}</span>;
}

export function Tag({ children }) {
  return <span className="inline-block rounded-md bg-ink/5 px-2 py-0.5 text-sm dark:bg-white/10">{children}</span>;
}

export function ExternalLink({ href, children, className = "" }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only"> (se abre en otra pestaña)</span>
    </a>
  );
}

export function PageHeader({ title, intro, children, color }) {
  return (
    <header className="border-b border-line bg-white py-10 dark:border-night-3 dark:bg-night-2 sm:py-14">
      <Container>
        {color && <span aria-hidden="true" className="mb-4 block h-1.5 w-16 rounded-full" style={{ background: color }} />}
        <h1 className="max-w-3xl text-4xl font-extrabold sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg text-ink/75 dark:text-slate-300">{intro}</p>}
        {children}
      </Container>
    </header>
  );
}
