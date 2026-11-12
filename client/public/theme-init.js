(function () {
  var mode = "system";
  try {
    mode = localStorage.getItem("rutatech-theme") || "system";
  } catch (e) {}
  var dark = mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
})();
