import { Container } from "../../components/ui.jsx";

export default function AuthShell({ title, intro, children, footer }) {
  return (
    <Container className="flex justify-center py-12 sm:py-16">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-extrabold">{title}</h1>
        {intro && <p className="mt-2 text-lg text-ink/75 dark:text-slate-300">{intro}</p>}
        <div className="mt-8 rounded-2xl border-2 border-line bg-white p-6 dark:border-night-3 dark:bg-night-2 sm:p-8">{children}</div>
        {footer && <div className="mt-6 text-center">{footer}</div>}
      </div>
    </Container>
  );
}
