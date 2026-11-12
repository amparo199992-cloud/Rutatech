// Editor de código sencillo y accesible: un textarea con números de línea y Tab = 4 espacios.
// Pulsa Esc y luego Tab para salir del editor con el teclado.
import { useRef, useState } from "react";

export default function CodeEditor({ value, onChange, label, language }) {
  const ref = useRef(null);
  const [escaped, setEscaped] = useState(false);
  const lines = value.split("\n").length;

  function onKeyDown(e) {
    if (e.key === "Escape") {
      setEscaped(true);
      return;
    }
    if (e.key === "Tab" && !escaped) {
      e.preventDefault();
      const el = ref.current;
      const { selectionStart: start, selectionEnd: end } = el;
      const next = value.slice(0, start) + "    " + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 4;
      });
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border-2 border-[#22305a] bg-[#101a33] focus-within:border-cobalt-400">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-sm text-slate-300">
        <span>{language === "javascript" ? "JavaScript" : "Python"}</span>
        <span>Tab inserta espacios · Esc + Tab para salir</span>
      </div>
      <div className="flex font-mono text-[0.92rem] leading-6">
        <div aria-hidden="true" className="select-none py-3 pl-3 pr-2 text-right text-slate-500">
          {Array.from({ length: lines }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => setEscaped(false)}
          aria-label={label}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          rows={Math.max(6, lines + 1)}
          className="w-full resize-y whitespace-pre bg-transparent py-3 pr-4 text-slate-100 outline-none"
        />
      </div>
    </div>
  );
}
