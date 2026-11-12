import { useState } from "react";
import { post } from "../../lib/api.js";
import { useAuth } from "../../lib/auth.jsx";
import { runChallenge } from "../../lib/runner.js";
import { useToast } from "../../lib/toast.jsx";
import { LoginPrompt } from "../ProtectedRoute.jsx";
import { Button } from "../ui.jsx";
import CodeEditor from "./CodeEditor.jsx";

const TYPE_LABEL = {
  choice: "Opción múltiple",
  fill: "Completa el código",
  output: "¿Qué imprime?",
  challenge: "Reto de programación",
};

function Feedback({ feedback, type }) {
  if (!feedback) return null;
  const ok = feedback.correct;
  return (
    <div
      role="status"
      className={`mt-4 rounded-xl border-l-4 px-4 py-3 ${ok ? "border-mint-500 bg-mint-50 dark:bg-mint-700/15" : "border-red-600 bg-red-50 dark:bg-red-950/50"}`}
    >
      <p className="font-bold">{ok ? "¡Correcto!" : "Todavía no"}</p>
      {feedback.hint && <p className="mt-1">{feedback.hint}</p>}
      {(ok || feedback.solution) && <p className="mt-1">{feedback.explanation}</p>}
      {!ok && feedback.solution && type === "fill" && (
        <p className="mt-2">
          Respuesta: <code className="rounded bg-white/70 px-1.5 font-mono dark:bg-night-3">{feedback.solution.blanks?.join(" · ")}</code>
        </p>
      )}
      {!ok && feedback.solution && type === "output" && (
        <pre className="mt-2 overflow-x-auto rounded-lg bg-white/70 p-2 font-mono text-sm dark:bg-night-3">{feedback.solution.output}</pre>
      )}
      {feedback.solution?.solution && (
        <details className="mt-2">
          <summary className="cursor-pointer font-semibold">Ver una solución posible</summary>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-[#101a33] p-3 font-mono text-sm text-slate-100">{feedback.solution.solution}</pre>
        </details>
      )}
    </div>
  );
}

function CodeBlock({ code }) {
  return (
    <pre tabIndex={0} className="mt-3 overflow-x-auto rounded-xl bg-[#101a33] p-4 font-mono text-[0.92rem] leading-6 text-slate-100">
      {code}
    </pre>
  );
}

function FillCode({ code, values, setValues, disabled }) {
  const parts = code.split("___");
  return (
    <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl bg-[#101a33] p-4 font-mono text-[0.92rem] leading-8 text-slate-100">
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <input
              aria-label={`Espacio en blanco ${i + 1}`}
              value={values[i] ?? ""}
              disabled={disabled}
              onChange={(e) => setValues((v) => Object.assign([...v], { [i]: e.target.value }))}
              spellCheck={false}
              autoCapitalize="off"
              className="mx-1 inline-block w-32 rounded-md border-2 border-signal bg-[#22305a] px-2 py-0.5 text-signal outline-none focus:border-white"
            />
          )}
        </span>
      ))}
    </pre>
  );
}

function storageKey(id) {
  return `rutatech-code-${id}`;
}
function loadCode(id, starter) {
  try {
    return localStorage.getItem(storageKey(id)) ?? starter;
  } catch {
    return starter;
  }
}

function ChallengeRunner({ exercise, onChecked, canSubmit }) {
  const { data } = exercise;
  const [code, setCode] = useState(() => loadCode(exercise.id, data.starter));
  const [running, setRunning] = useState(false);
  const [run, setRun] = useState(null);

  function updateCode(v) {
    setCode(v);
    try {
      localStorage.setItem(storageKey(exercise.id), v);
    } catch {
      // sin almacenamiento local: el código no se recuerda entre visitas
    }
  }

  async function execute() {
    setRunning(true);
    setRun(null);
    try {
      const result = await runChallenge({ language: data.language, code, functionName: data.functionName, tests: data.tests });
      setRun(result);
      const passed = result.ok && result.results.every((r) => r.passed);
      // Un fallo de red al cargar Python no cuenta como intento.
      if (canSubmit && !result.infra) await onChecked({ passed });
    } catch (err) {
      setRun({ ok: false, error: err.message });
    } finally {
      setRunning(false);
    }
  }

  const show = (v) => JSON.stringify(v);
  const passedCount = run?.results?.filter((r) => r.passed).length ?? 0;

  return (
    <div className="mt-3">
      <CodeEditor value={code} onChange={updateCode} language={data.language} label={`Editor de código para el reto: ${exercise.prompt}`} />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button onClick={execute} loading={running}>
          {running ? (data.language === "python" ? "Ejecutando (la primera vez tarda en cargar Python)…" : "Ejecutando…") : "Ejecutar pruebas"}
        </Button>
        <Button variant="ghost" onClick={() => updateCode(data.starter)} disabled={running}>
          Restaurar código inicial
        </Button>
      </div>
      {run && (
        <div aria-live="polite" className="mt-4 space-y-2">
          {!run.ok && (
            <div className="rounded-xl bg-red-50 p-3 dark:bg-red-950/50">
              <p className="font-bold">Tu código tiene un error</p>
              <pre className="mt-1 overflow-x-auto whitespace-pre-wrap font-mono text-sm">{run.error}</pre>
            </div>
          )}
          {run.ok && (
            <>
              <p className="font-semibold">
                Pruebas superadas: {passedCount} de {run.results.length}
              </p>
              <ul className="space-y-1.5">
                {run.results.map((r, i) => (
                  <li key={i} className={`rounded-lg px-3 py-2 font-mono text-sm ${r.passed ? "bg-mint-50 dark:bg-mint-700/15" : "bg-red-50 dark:bg-red-950/50"}`}>
                    <span aria-hidden="true">{r.passed ? "✔ " : "✘ "}</span>
                    <span className="sr-only">{r.passed ? "Prueba superada: " : "Prueba fallida: "}</span>
                    {data.functionName}({r.args.map(show).join(", ")}) → esperado {show(r.expected)}
                    {!r.passed && (r.error ? `, error: ${r.error}` : `, obtuviste ${show(r.got)}`)}
                  </li>
                ))}
              </ul>
            </>
          )}
          {run.logs?.length > 0 && (
            <details>
              <summary className="cursor-pointer font-semibold">Salida de print / console.log</summary>
              <pre className="mt-1 overflow-x-auto rounded-lg bg-[#101a33] p-3 font-mono text-sm text-slate-100">{run.logs.join("\n")}</pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

export default function ExerciseCard({ exercise, index }) {
  const { user, setUser } = useAuth();
  const { celebrate, notify } = useToast();
  const [selected, setSelected] = useState(null);
  const [blanks, setBlanks] = useState([]);
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState(
    exercise.result?.correct ? { correct: true, explanation: exercise.result.explanation } : null
  );
  const [sending, setSending] = useState(false);
  const solved = feedback?.correct;

  async function check(answer) {
    setSending(true);
    try {
      const r = await post(`/exercises/${exercise.id}/check`, { answer });
      setFeedback(r);
      setUser(r.user);
      celebrate(r);
    } catch (err) {
      notify(err.message, { tone: "error" });
    } finally {
      setSending(false);
    }
  }

  function submit(e) {
    e.preventDefault();
    if (exercise.type === "choice") check(selected);
    if (exercise.type === "fill") check(blanks);
    if (exercise.type === "output") check(text);
  }

  const { data } = exercise;
  const ready =
    (exercise.type === "choice" && selected !== null) ||
    (exercise.type === "fill" && blanks.filter((b) => b?.trim()).length === (data.code.match(/___/g) || []).length) ||
    (exercise.type === "output" && text.trim());

  return (
    <section className="rounded-2xl border-2 border-line bg-white p-5 dark:border-night-3 dark:bg-night-2 sm:p-6" aria-labelledby={`ej-${exercise.id}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-cobalt-600 dark:text-cobalt-300">
          Ejercicio {index + 1}: {TYPE_LABEL[exercise.type]}
        </p>
        <p className="text-sm text-ink/60 dark:text-slate-400">{solved ? "Resuelto ✓" : `${exercise.points} puntos`}</p>
      </div>
      <h3 id={`ej-${exercise.id}`} className="mt-2 font-sans text-lg font-semibold tracking-normal">
        {exercise.prompt}
      </h3>

      {exercise.type === "challenge" ? (
        <>
          <ChallengeRunner exercise={exercise} canSubmit={Boolean(user) && !solved} onChecked={check} />
          {!user && (
            <div className="mt-3">
              <LoginPrompt action="que tus retos resueltos sumen puntos" />
            </div>
          )}
          <Feedback feedback={feedback} type="challenge" />
        </>
      ) : (
        <form onSubmit={submit}>
          {exercise.type === "choice" && (
            <fieldset className="mt-3 space-y-2">
              <legend className="sr-only">Opciones</legend>
              {data.options.map((opt, i) => (
                <label
                  key={i}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 px-4 py-3 ${
                    selected === i ? "border-cobalt-500 bg-cobalt-50 dark:bg-cobalt-500/15" : "border-line hover:border-cobalt-300 dark:border-night-3"
                  }`}
                >
                  <input type="radio" name={`ej-${exercise.id}`} className="mt-1 h-5 w-5 accent-cobalt-500" checked={selected === i} onChange={() => setSelected(i)} />
                  <span>{opt}</span>
                </label>
              ))}
            </fieldset>
          )}
          {exercise.type === "fill" && <FillCode code={data.code} values={blanks} setValues={setBlanks} />}
          {exercise.type === "output" && (
            <>
              <CodeBlock code={data.code} />
              <label htmlFor={`out-${exercise.id}`} className="mt-3 block font-semibold">
                Tu respuesta
              </label>
              <textarea
                id={`out-${exercise.id}`}
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={Math.max(2, text.split("\n").length)}
                spellCheck={false}
                className="mt-1 w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-2 font-mono focus:border-cobalt-500 focus:outline-none dark:border-white/15 dark:bg-night"
              />
            </>
          )}
          {user ? (
            <Button type="submit" className="mt-4" loading={sending} disabled={!ready}>
              Comprobar respuesta
            </Button>
          ) : (
            <div className="mt-4">
              <LoginPrompt action="comprobar tus respuestas y sumar puntos" />
            </div>
          )}
          <Feedback feedback={feedback} type={exercise.type} />
        </form>
      )}
    </section>
  );
}
