import { Link, NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, type ReactNode } from "react";
import { useStore } from "../store/AppStore";
import { UserIcon } from "./Icons";

/** Título com o ponto azul, como "Cadastro." no app. */
export function Title({ children, as: Tag = "h1" }: { children: ReactNode; as?: "h1" | "h2" }) {
  return (
    <Tag className={Tag === "h1" ? "title" : "section-title"}>
      {children}
      <span className="dot">.</span>
    </Tag>
  );
}

/** Só deixa passar com sessão iniciada e termos aceites. */
export function RequireAuth() {
  const { isLoggedIn, auth } = useStore();
  const location = useLocation();
  if (!isLoggedIn) return <Navigate to="/entrar" replace state={{ from: location.pathname }} />;
  if (!auth.termsAccepted) return <Navigate to="/termos" replace />;
  return <Outlet />;
}

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · namao`;
  }, [title]);
}

/** Cabeçalho e fundo de pontos das páginas autenticadas. */
export function AppLayout() {
  const { user } = useStore();
  const { pathname } = useLocation();
  const borrowersActive = pathname === "/" || pathname.startsWith("/mutuarios");

  return (
    <div className="app">
      <img src="/assets/bg-dots.png" alt="" aria-hidden="true" className="bg-dots" />
      <header className="header">
        <div className="header__inner">
          <Link to="/mutuarios" className="header__logo" aria-label="namao — início">
            <img src="/assets/logo.png" alt="namao" />
          </Link>
          <nav className="tabs tabs--nav" aria-label="Principal">
            <NavLink to="/mutuarios" className={() => `tab${borrowersActive ? " active" : ""}`} aria-current={borrowersActive ? "page" : undefined}>
              Mutuários
            </NavLink>
            <NavLink to="/pesquisar" className={({ isActive }) => `tab${isActive ? " active" : ""}`}>
              Pesquisar
            </NavLink>
            <NavLink to="/notificacoes" className={({ isActive }) => `tab${isActive ? " active" : ""}`}>
              Notificações
            </NavLink>
          </nav>
          <div className="header__spacer" />
          <NavLink to="/conta" className={({ isActive }) => `header__user${isActive ? " active" : ""}`} aria-label="Conta">
            <span className="header__user-text">
              <b>{user?.name}</b>
              <span>{user?.institution}</span>
            </span>
            <span className="user-avatar">
              <UserIcon />
            </span>
          </NavLink>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
