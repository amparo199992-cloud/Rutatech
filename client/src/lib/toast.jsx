import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);
let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((message, { tone = "info", icon, duration = 4500 } = {}) => {
    const id = nextId++;
    setToasts((list) => [...list, { id, message, tone, icon }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), duration);
  }, []);

  // Muestra puntos e insignias que devuelve la API después de cada acción.
  const celebrate = useCallback(
    (result) => {
      if (!result) return;
      if (result.pointsEarned > 0) notify(`+${result.pointsEarned} puntos`, { tone: "success", icon: "⭐" });
      for (const b of result.newBadges ?? []) {
        notify(`Nueva insignia: ${b.name}`, { tone: "badge", icon: b.icon, duration: 6500 });
      }
    },
    [notify]
  );

  const tones = {
    info: "bg-ink text-paper dark:bg-paper dark:text-ink",
    success: "bg-mint-700 text-white",
    error: "bg-red-700 text-white",
    badge: "bg-signal text-ink",
  };

  return (
    <ToastContext.Provider value={{ notify, celebrate }}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(92vw,22rem)] flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} role="status" className={`toast-in pointer-events-auto flex items-center gap-3 rounded-xl px-4 py-3 font-medium shadow-lg ${tones[t.tone]}`}>
            {t.icon && <span aria-hidden="true" className="text-xl">{t.icon}</span>}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
