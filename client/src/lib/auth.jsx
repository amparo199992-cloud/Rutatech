import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { get, post } from "./api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    get("/auth/me")
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async (email, password) => {
    const d = await post("/auth/login", { email, password });
    setUser(d.user);
    return d.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const d = await post("/auth/register", { name, email, password });
    setUser(d.user);
    return d.user;
  }, []);

  const logout = useCallback(async () => {
    await post("/auth/logout").catch(() => {});
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, ready, setUser, login, register, logout }), [user, ready, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
