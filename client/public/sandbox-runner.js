/* Ejecutor aislado de retos de programación (JavaScript y Python con Pyodide). */
(function () {
  var PYODIDE_VERSION = "0.29.5";
  var PYODIDE_URL = "https://cdn.jsdelivr.net/npm/pyodide@" + PYODIDE_VERSION + "/";

  // Código del worker como texto: se crea desde un Blob porque esta página tiene origen opaco.
  var workerSource = [
    "var DEFAULT_PYODIDE_URL = " + JSON.stringify(PYODIDE_URL) + ";",
    "var pyodidePromise = null;",
    "function sortKeys(v){ if(Array.isArray(v)) return v.map(sortKeys); if(v && typeof v === 'object'){ var o={}; Object.keys(v).sort().forEach(function(k){ o[k]=sortKeys(v[k]); }); return o; } return v; }",
    "function equal(a,b){ if(typeof a==='number' && typeof b==='number') return Math.abs(a-b) < 1e-9; return JSON.stringify(sortKeys(a)) === JSON.stringify(sortKeys(b)); }",
    "function fmt(v){ if(typeof v === 'string') return v; try { return JSON.stringify(v); } catch(e){ return String(v); } }",
    "function loadPy(url){ var base = url || DEFAULT_PYODIDE_URL; if(!pyodidePromise){ pyodidePromise = (async function(){ try { importScripts(base + 'pyodide.js'); } catch(e){ var le = new Error('No se pudo descargar Python (Pyodide) desde ' + base + '. Revisa tu conexión a internet o si tu red bloquea ese sitio, y vuelve a intentarlo.'); le.infra = true; throw le; } return await loadPyodide({ indexURL: base }); })(); pyodidePromise.catch(function(){ pyodidePromise = null; }); } return pyodidePromise; }",
    "function pyError(err){ var msg = String(err && err.message || err); var lines = msg.trim().split('\\n'); var useful = lines.filter(function(l){ return l.indexOf('File \"<exec>\"') !== -1 || !/^\\s*File /.test(l); }); return useful.slice(-4).join('\\n'); }",
    "async function runJs(job, logs){",
    "  var c = { log: function(){ logs.push(Array.prototype.map.call(arguments, fmt).join(' ')); } }; c.error = c.log; c.warn = c.log; c.info = c.log;",
    "  var factory = new Function('console', '\"use strict\";\\n' + job.code + '\\n;return typeof ' + job.functionName + \" === 'function' ? \" + job.functionName + ' : undefined;');",
    "  var fn = factory(c);",
    "  if(!fn) throw new Error('No encontramos la función ' + job.functionName + '. Revisa que el nombre esté bien escrito.');",
    "  return job.tests.map(function(t){ try { var got = fn.apply(null, JSON.parse(JSON.stringify(t.args))); return { args: t.args, expected: t.expected, got: got === undefined ? null : got, passed: equal(got === undefined ? null : got, t.expected) }; } catch(e){ return { args: t.args, expected: t.expected, error: String(e && e.message || e), passed: false }; } });",
    "}",
    "async function runPy(job, logs){",
    "  var py = await loadPy(job.pyodideUrl);",
    "  py.setStdout({ batched: function(s){ logs.push(s); } });",
    "  py.setStderr({ batched: function(s){ logs.push(s); } });",
    "  var ns = py.globals.get('dict')();",
    "  try { py.runPython(job.code, { globals: ns }); } catch(e){ throw new Error(pyError(e)); }",
    "  if(!ns.has(job.functionName)) throw new Error('No encontramos la función ' + job.functionName + '. Revisa que el nombre esté bien escrito.');",
    "  return job.tests.map(function(t){",
    "    try { ns.set('__args_json', JSON.stringify(t.args)); var out = py.runPython('import json as __j\\n__j.dumps(' + job.functionName + '(*__j.loads(__args_json)))', { globals: ns }); var got = JSON.parse(out); return { args: t.args, expected: t.expected, got: got, passed: equal(got, t.expected) }; }",
    "    catch(e){ return { args: t.args, expected: t.expected, error: pyError(e), passed: false }; }",
    "  });",
    "}",
    "self.onmessage = async function(e){",
    "  var job = e.data; var logs = [];",
    "  try { var results = job.language === 'python' ? await runPy(job, logs) : await runJs(job, logs); self.postMessage({ id: job.id, ok: true, results: results, logs: logs }); }",
    "  catch(err){ self.postMessage({ id: job.id, ok: false, infra: Boolean(err && err.infra), error: String(err && err.message || err), logs: logs }); }",
    "};",
  ].join("\n");

  var worker = null;
  var pythonReady = false;

  function getWorker() {
    if (!worker) {
      var url = URL.createObjectURL(new Blob([workerSource], { type: "text/javascript" }));
      worker = new Worker(url);
    }
    return worker;
  }

  function reply(data) {
    window.parent.postMessage(data, "*");
  }

  window.addEventListener("message", function (event) {
    if (event.source !== window.parent) return;
    var job = event.data;
    if (!job || job.kind !== "run") return;

    var w;
    try {
      w = getWorker();
    } catch (e) {
      reply({ id: job.id, ok: false, error: "Tu navegador no permite ejecutar código aquí: " + e.message });
      return;
    }

    // Más tiempo la primera vez que se carga Python (descarga ~10 MB).
    var limit = job.language === "python" ? (pythonReady ? 10000 : 60000) : 4000;
    var finished = false;
    var timer = setTimeout(function () {
      if (finished) return;
      finished = true;
      worker.terminate();
      worker = null;
      pythonReady = false;
      reply({
        id: job.id,
        ok: false,
        timeout: true,
        error: "Tu código tardó demasiado (más de " + limit / 1000 + " s). ¿Hay un bucle que nunca termina?",
      });
    }, limit);

    function onMessage(e) {
      if (e.data.id !== job.id || finished) return;
      finished = true;
      clearTimeout(timer);
      w.removeEventListener("message", onMessage);
      if (job.language === "python" && e.data.ok) pythonReady = true;
      reply(e.data);
    }
    w.addEventListener("message", onMessage);
    w.postMessage({ id: job.id, language: job.language, code: job.code, functionName: job.functionName, tests: job.tests, pyodideUrl: job.pyodideUrl });
  });

  reply({ kind: "ready" });
})();
