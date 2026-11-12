// Ejecuta el código de los retos en un iframe aislado (sandbox.html) y devuelve los resultados.
let frame = null;
let readyPromise = null;
const pending = new Map();
let counter = 0;
// Opcional: VITE_PYODIDE_URL="/pyodide/" para autoalojar Python (redes sin acceso a jsDelivr).
const PYODIDE_URL = import.meta.env.VITE_PYODIDE_URL ? new URL(import.meta.env.VITE_PYODIDE_URL, window.location.origin).href : undefined;

function ensureFrame() {
  if (readyPromise) return readyPromise;
  readyPromise = new Promise((resolve, reject) => {
    frame = document.createElement("iframe");
    frame.src = "/sandbox.html";
    frame.title = "Entorno aislado para ejecutar código";
    frame.setAttribute("sandbox", "allow-scripts"); // origen opaco: sin acceso a cookies ni a la página
    frame.setAttribute("aria-hidden", "true");
    frame.tabIndex = -1;
    frame.style.cssText = "position:absolute;width:0;height:0;border:0;visibility:hidden";
    const timeout = setTimeout(() => reject(new Error("No se pudo iniciar el entorno de ejecución.")), 10000);

    window.addEventListener("message", (event) => {
      if (!frame || event.source !== frame.contentWindow) return;
      const data = event.data || {};
      if (data.kind === "ready") {
        clearTimeout(timeout);
        resolve();
        return;
      }
      const job = pending.get(data.id);
      if (job) {
        pending.delete(data.id);
        job(data);
      }
    });
    document.body.append(frame);
  });
  readyPromise.catch(() => {
    readyPromise = null;
    frame?.remove();
    frame = null;
  });
  return readyPromise;
}

export async function runChallenge({ language, code, functionName, tests }) {
  await ensureFrame();
  const id = `job-${++counter}`;
  return new Promise((resolve) => {
    const guard = setTimeout(() => {
      pending.delete(id);
      resolve({ ok: false, error: "El entorno no respondió. Recarga la página e inténtalo de nuevo." });
    }, 75000);
    pending.set(id, (data) => {
      clearTimeout(guard);
      resolve(data);
    });
    frame.contentWindow.postMessage({ kind: "run", id, language, code, functionName, tests, pyodideUrl: PYODIDE_URL }, "*");
  });
}
