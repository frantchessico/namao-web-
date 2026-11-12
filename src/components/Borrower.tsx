import { Link } from "react-router-dom";
import type { Borrower, StatusEntry } from "../types";
import { borrowerColor, fullName, initials, latestStatus, STATUS_COLORS } from "../utils/format";

export function Avatar({ borrower }: { borrower: Borrower }) {
  return (
    <span className="avatar" style={{ background: borrowerColor(borrower) }} aria-hidden="true">
      {initials(borrower)}
    </span>
  );
}

export function StatusPill({ borrower }: { borrower: Borrower }) {
  const s = latestStatus(borrower);
  if (!s) return <span className="pill pill--none">Sem estado</span>;
  return (
    <span className="pill" style={{ background: STATUS_COLORS[s.type] }}>
      {s.type}
    </span>
  );
}

export function PersonCell({ borrower, sub }: { borrower: Borrower; sub: string }) {
  return (
    <Link to={`/mutuarios/${borrower.id}`} className="person">
      <Avatar borrower={borrower} />
      <span className="person__text">
        <span className="person__name">{fullName(borrower)}</span>
        <span className="person__sub">{sub}</span>
      </span>
    </Link>
  );
}

const MAX_DOTS = 12;

/**
 * Pilha de estados: um círculo por registo, cada um metade por cima do anterior,
 * do mais antigo (esquerda) ao mais recente (direita). Passado o limite, mostra
 * os mais recentes e um "+N" com os restantes.
 */
export function StatusStack({ statuses }: { statuses: StatusEntry[] }) {
  const hidden = Math.max(0, statuses.length - MAX_DOTS);
  const visible = statuses.slice(hidden);
  return (
    <div className="stack-bar">
      <div className="stack" role="img" aria-label={`${statuses.length} registos de estado`}>
        {hidden > 0 && (
          <span className="stack__more" style={{ zIndex: 0 }}>
            +{hidden}
          </span>
        )}
        {visible.map((s, i) => (
          <span key={s.id} className="stack__dot" style={{ background: STATUS_COLORS[s.type], zIndex: i + 1 }} />
        ))}
        {statuses.length === 0 && <span className="stack__dot" style={{ background: "#C9D2E3" }} />}
      </div>
      <span className="stack-count">
        Registos de estado<b>{statuses.length}</b>
      </span>
    </div>
  );
}
