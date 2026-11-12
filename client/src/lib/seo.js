import { useEffect } from "react";

const DEFAULT_DESCRIPTION =
  "Ruta gratuita y práctica para aprender tecnología desde cero: fundamentos, Python, ciencias de la computación, desarrollo web, bases de datos, Git y una especialización.";

// SEO básico por página: título y descripción.
export function useSeo(title, description = DEFAULT_DESCRIPTION) {
  useEffect(() => {
    document.title = title ? `${title} · RutaTech` : "RutaTech · Aprende tecnología desde cero, paso a paso";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.append(meta);
    }
    meta.content = description;
  }, [title, description]);
}
