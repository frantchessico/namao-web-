import { Link, useLocation } from "react-router-dom";
import { Check } from "../components/Icons";
import { useDocumentTitle } from "../components/Layout";

type SuccessState = {
  title?: string;
  subtitle?: string;
  message?: string;
  next?: string;
  nextLabel?: string;
};

/** Ecrã azul de confirmação (SucessMessage do app). */
export function Success() {
  const s = (useLocation().state ?? {}) as SuccessState;
  const title = s.title ?? "Operação";
  const subtitle = s.subtitle ?? "Concluída!";
  useDocumentTitle(`${title} ${subtitle}`);

  return (
    <div className="success">
      <img src="/assets/bg-message.png" alt="" aria-hidden="true" className="decor" style={{ left: 0 }} />
      <img src="/assets/bg-message.png" alt="" aria-hidden="true" className="decor" style={{ right: 0 }} />
      <div className="success__body">
        <div className="success__icon">
          <Check size={32} />
        </div>
        <h1 className="success__title">
          {title}
          <br />
          {subtitle}
        </h1>
        {s.message && <p className="success__text">{s.message}</p>}
        <div className="success__actions">
          <Link to="/mutuarios" className="btn btn--white btn--block" autoFocus>
            Voltar aos mutuários
          </Link>
          {s.next && (
            <Link to={s.next} className="btn btn--link" style={{ alignSelf: "center" }}>
              {s.nextLabel ?? "Continuar"}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
