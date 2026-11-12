import { useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { StatusStack } from "../components/Borrower";
import { ArrowLeft, Download, Redo } from "../components/Icons";
import { Title, useDocumentTitle } from "../components/Layout";
import { useStore } from "../store/AppStore";
import { borrowerColor, formatDate, formatShortDate, fullName, latestStatus, STATUS_COLORS } from "../utils/format";
import { formatPhone } from "../utils/ids";

const VISIBLE = 3;

export function Details() {
  const { id = "" } = useParams();
  const { getBorrower, isImported, importBorrower } = useStore();
  const navigate = useNavigate();
  const b = getBorrower(id);
  const [showAll, setShowAll] = useState(false);
  const [importing, setImporting] = useState(false);
  useDocumentTitle(b ? fullName(b) : "Mutuário");

  if (!b) {
    return (
      <main className="main main--narrow">
        <Title>Mutuário não encontrado</Title>
        <p className="subtitle">Este mutuário não existe ou foi removido.</p>
        <Link to="/mutuarios" className="btn btn--primary btn--md" style={{ marginTop: 24 }}>
          Voltar aos mutuários
        </Link>
      </main>
    );
  }

  const latest = latestStatus(b);
  const mine = b.owner === "me";
  const imported = isImported(b.id);
  const canUpdate = mine || imported;
  const history = [...b.statuses].reverse();
  const shown = showAll ? history : history.slice(0, VISIBLE);

  const doImport = async () => {
    setImporting(true);
    await importBorrower(b.id);
    setImporting(false);
    navigate("/sucesso", {
      state: { title: "Importação", subtitle: "Completa!", message: "Agora você pode verificar o cadastro do seu mutuário!", next: `/mutuarios/${b.id}`, nextLabel: "Ver mutuário" },
    });
  };

  return (
    <>
      <section className="hero" style={{ background: borrowerColor(b), boxShadow: `0 10px 0 ${borrowerColor(b)}33` }}>
        <div className="hero__inner">
          <button type="button" className="icon-btn icon-btn--white" aria-label="Voltar" onClick={() => navigate(-1)}>
            <ArrowLeft />
          </button>
          <div style={{ flex: "1 1 300px" }}>
            <h1 className="hero__name">{fullName(b)}</h1>
            <p className="hero__sub">
              {b.nuit ? `NUIT ${b.nuit}` : "NUIT indisponível"} · {latest?.type ?? "Sem estado"}
            </p>
          </div>
          <div className="hero__actions">
            {canUpdate ? (
              <Link to="status" className="btn btn--white btn--md" style={{ fontSize: 15 }}>
                <Redo size={18} />
                Actualizar o status
              </Link>
            ) : (
              <button type="button" className="btn btn--white btn--md" style={{ fontSize: 15 }} onClick={doImport} disabled={importing}>
                {importing ? <span className="spinner" /> : <Download size={18} />}
                Importar
              </button>
            )}
          </div>
        </div>
      </section>

      <main className="main columns" style={{ paddingTop: 48 }}>
        <section className="columns__side">
          <Title as="h2">Detalhes</Title>
          <dl className="info-list">
            <div>
              <dt>Tipo Documento</dt>
              <dd>{b.docType}</dd>
            </div>
            <div>
              <dt>Número Documento</dt>
              <dd>{b.docNumber}</dd>
            </div>
            <div>
              <dt>Género</dt>
              <dd>{b.gender}</dd>
            </div>
            <div>
              <dt>Telefone</dt>
              <dd>{formatPhone(b.phone)}</dd>
            </div>
            <div>
              <dt>Endereço</dt>
              <dd>{b.address || "Não informado"}</dd>
            </div>
            {b.email && (
              <div>
                <dt>Email</dt>
                <dd>{b.email}</dd>
              </div>
            )}
            <div>
              <dt>Data de contrato</dt>
              <dd>{formatDate(b.contractDate)}</dd>
            </div>
            <div>
              <dt>Registado por</dt>
              <dd>
                {b.registeredBy} · {b.institution}
              </dd>
            </div>
          </dl>
        </section>

        <section className="columns__main">
          <Title as="h2">Status</Title>
          <StatusStack statuses={b.statuses} />
          {history.length === 0 ? (
            <p className="empty" style={{ padding: "48px 16px" }}>
              Ainda não há registos de estado.
              {canUpdate && (
                <>
                  <br />
                  <Link to="status">Registar o primeiro estado</Link>
                </>
              )}
            </p>
          ) : (
            <>
              <ol className="timeline">
                {shown.map((s) => (
                  <li key={s.id}>
                    <span className="timeline__date">{formatShortDate(s.date)}</span>
                    <span className="timeline__rail" aria-hidden="true" />
                    <div className="timeline__card" style={{ background: STATUS_COLORS[s.type] }}>
                      <b>{s.type}</b>
                      <p>{s.institution}</p>
                      {s.note && <p>{s.note}</p>}
                    </div>
                  </li>
                ))}
              </ol>
              {history.length > VISIBLE && (
                <button type="button" className="btn btn--link" style={{ marginLeft: 104, marginTop: 12 }} onClick={() => setShowAll((v) => !v)}>
                  {showAll ? "Mostrar só os mais recentes" : `Ver todos os registos (${history.length})`}
                </button>
              )}
            </>
          )}
        </section>
      </main>
      <Outlet />
    </>
  );
}
