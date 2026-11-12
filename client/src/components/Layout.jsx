import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "../lib/auth.jsx";
import { useTheme } from "../lib/theme.jsx";
import { buttonClass, Container } from "./ui.jsx";

const NAV = [
  { to: "/ruta", label: "Ruta" },
  { to: "/modulos", label: "Módulos" },
  { to: "/proyectos", label: "Proyectos" },
  { to: "/recursos", label: "Recursos" },
];

function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-11 w-11 items-center justify-center rounded-xl text-xl hover:bg-ink/5 dark:hover:bg-white/10"
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
    >
      <span aria-hidden="true">{isDark ? "☀️" : "🌙"}</span>
    </button>
  );
}

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 rounded-lg font-display text-xl font-extrabold">
      <img src="/favicon.svg" alt="" width="32" height="32" />
      RutaTech
    </Link>
  );
}

const navClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 font-semibold ${isActive ? "text-cobalt-600 dark:text-cobalt-300" : "hover:text-cobalt-600 dark:hover:text-cobalt-300"}`;

function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur dark:border-night-3 dark:bg-night/95">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={navClass}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {user ? (
            <div className="hidden items-center gap-1 md:flex">
              {user.role === "ADMIN" && (
                <NavLink to="/admin" className={navClass}>
                  Admin
                </NavLink>
              )}
              <NavLink to="/panel" className={navClass}>
                Mi panel
              </NavLink>
              <Link to="/perfil" className="flex items-center gap-2 rounded-lg px-2 py-1" title="Mi perfil">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cobalt-500 font-bold text-white" aria-hidden="true">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="sr-only">Mi perfil</span>
              </Link>
              <button onClick={handleLogout} className="rounded-lg px-3 py-2 font-semibold hover:text-cobalt-600">
                Salir
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/ingresar" className="rounded-lg px-3 py-2 font-semibold hover:text-cobalt-600">
                Iniciar sesión
              </Link>
              <Link to="/registro" className={buttonClass("primary", "sm")}>
                Comenzar gratis
              </Link>
            </div>
          )}
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-ink/5 md:hidden dark:hover:bg-white/10"
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
            <span aria-hidden="true" className="text-2xl leading-none">
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </Container>
      {open && (
        <nav id="menu-movil" aria-label="Menú móvil" className="border-t border-line bg-paper pb-4 md:hidden dark:border-night-3 dark:bg-night">
          <Container className="flex flex-col gap-1 pt-3">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} className={navClass}>
                {n.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <NavLink to="/panel" className={navClass}>
                  Mi panel
                </NavLink>
                <NavLink to="/perfil" className={navClass}>
                  Mi perfil
                </NavLink>
                {user.role === "ADMIN" && (
                  <NavLink to="/admin" className={navClass}>
                    Administración
                  </NavLink>
                )}
                <button onClick={handleLogout} className="rounded-lg px-3 py-2 text-left font-semibold">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link to="/ingresar" className={buttonClass("secondary")}>
                  Iniciar sesión
                </Link>
                <Link to="/registro" className={buttonClass("primary")}>
                  Comenzar gratis
                </Link>
              </div>
            )}
          </Container>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-white py-12 dark:border-night-3 dark:bg-night-2">
      <Container className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-ink/70 dark:text-slate-400">Una ruta práctica y gratuita para aprender tecnología desde cero, a tu ritmo.</p>
        </div>
        <div>
          <h2 className="font-display text-lg font-bold">Aprender</h2>
          <ul className="mt-3 space-y-2">
            <li><Link to="/ruta" className="hover:underline">Ruta completa</Link></li>
            <li><Link to="/modulos" className="hover:underline">Módulos</Link></li>
            <li><Link to="/especializaciones" className="hover:underline">Especializaciones</Link></li>
            <li><Link to="/proyectos" className="hover:underline">Proyectos</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-lg font-bold">Recursos</h2>
          <ul className="mt-3 space-y-2">
            <li><Link to="/recursos" className="hover:underline">Biblioteca de recursos</Link></li>
            <li><a href="https://cs50.harvard.edu/x/" target="_blank" rel="noopener noreferrer" className="hover:underline">CS50 de Harvard</a></li>
            <li><a href="https://developer.mozilla.org/es/" target="_blank" rel="noopener noreferrer" className="hover:underline">MDN Web Docs</a></li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-lg font-bold">RutaTech</h2>
          <ul className="mt-3 space-y-2">
            <li><Link to="/contacto" className="hover:underline">Contacto</Link></li>
            <li><Link to="/privacidad" className="hover:underline">Política de privacidad</Link></li>
            <li><a href="/sitemap.xml" className="hover:underline">Mapa del sitio</a></li>
          </ul>
        </div>
      </Container>
      <Container className="mt-10 text-sm text-ink/60 dark:text-slate-500">
        <p>Los cursos y sitios enlazados pertenecen a sus autores; RutaTech no está afiliada a ellos y solo los recomienda.</p>
        <p className="mt-1">© {new Date().getFullYear()} RutaTech.</p>
      </Container>
    </footer>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-cobalt-500 focus:px-4 focus:py-2 focus:text-white">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido" tabIndex={-1} className="min-h-[60vh] focus:outline-none">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
