import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Power, UserIcon } from "../components/Icons";
import { Title, useDocumentTitle } from "../components/Layout";
import { useStore } from "../store/AppStore";
import { STATUS_TYPES } from "../types";
import { latestStatus, STATUS_COLORS } from "../utils/format";

// Ordem do ecrã de Conta do app: em andamento, sem crédito, devedor.
const ORDER = [STATUS_TYPES[1], STATUS_TYPES[0], STATUS_TYPES[2]];

export function Account() {
  useDocumentTitle("Conta");
  const { user, myBorrowers, logout } = useStore();
  const navigate = useNavigate();
  const total = myBorrowers.length;
  const counts = ORDER.map((type) => ({
    type,
    count: myBorrowers.filter((b) => latestStatus(b)?.type === type).length,
  }));

  return (
    <main className="main">
      <section className="profile">
        <img src="/assets/bg-message.png" alt="" aria-hidden="true" className="decor" />
        <div className="profile__top">
          <div>
            <h1 className="profile__name">{user?.name}</h1>
            <p className="profile__email">
              {user?.email} · {user?.role} · {user?.institution}
            </p>
          </div>
          <button
            type="button"
            className="profile__logout"
            onClick={() => {
              logout();
              navigate("/entrar", { replace: true });
            }}
          >
            <Power size={18} />
            Terminar sessão
          </button>
        </div>
        <div className="profile__stats">
          <div className="profile__total">
            <span
              style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(250,250,250,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <UserIcon size={18} />
            </span>
            <span>
              <b>{total}</b>
              <span>{total === 1 ? "mutuário" : "mutuários"}</span>
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", rowGap: 16 }}>
            {counts.map((c) => (
              <div className="profile__stat" key={c.type}>
                <b>{c.count}</b>
                <span>{c.type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="columns" style={{ marginTop: 40 }}>
        <section className="columns__main">
          <Title as="h2">Actividade</Title>
          <div className="activity">
            {counts.map((c) => {
              const pct = total ? Math.round((c.count / total) * 100) : 0;
              return (
                <div className="activity__row" key={c.type}>
                  <span className="activity__label">{c.type}</span>
                  <span
                    className="activity__track"
                    role="progressbar"
                    aria-label={c.type}
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <span className="activity__fill" style={{ width: `${pct}%`, background: STATUS_COLORS[c.type] }} />
                  </span>
                  <span className="activity__pct">{pct}%</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="columns__side">
          <Title as="h2">Conta</Title>
          <nav className="menu-list" aria-label="Conta">
            <a href="#politica" onClick={(e) => e.preventDefault()} aria-disabled="true" title="Ainda não disponível no protótipo">
              Política de privacidade
              <ChevronRight size={18} />
            </a>
            <Link to="/termos">
              Termos e condições
              <ChevronRight size={18} />
            </Link>
            <Link to="/conta/eliminar" className="danger">
              Eliminar conta
              <ChevronRight size={18} />
            </Link>
          </nav>
        </section>
      </div>
    </main>
  );
}
