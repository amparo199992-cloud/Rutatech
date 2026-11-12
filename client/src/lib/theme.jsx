import { createContext, useContext, useEffect, useState } from "react";

const KEY = "rutatech-theme";
const ThemeContext = createContext(null);
const media = () => window.matchMedia("(prefers-color-scheme: dark)");

function readMode() {
  try {
    return localStorage.getItem(KEY) || "system";
  } catch {
    return "system";
  }
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(readMode);
  const [systemDark, setSystemDark] = useState(() => media().matches);
  const isDark = mode === "dark" || (mode === "system" && systemDark);

  useEffect(() => {
    const m = media();
    const onChange = () => setSystemDark(m.matches);
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    try {
      localStorage.setItem(KEY, mode);
    } catch {
      // almacenamiento no disponible: el tema solo dura esta visita
    }
  }, [mode, isDark]);

  const toggle = () => setMode(isDark ? "light" : "dark");
  return <ThemeContext.Provider value={{ mode, setMode, toggle, isDark }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
