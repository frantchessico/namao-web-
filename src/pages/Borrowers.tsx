import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AppAlert } from "../components/AppAlert";
import { PersonCell, StatusPill } from "../components/Borrower";
import { Plus, Redo, Trash } from "../components/Icons";
import { Title, useDocumentTitle } from "../components/Layout";
import { Tabs } from "../components/Tabs";
import { useStore } from "../store/AppStore";
import type { Borrower } from "../types";
import { formatDate, fullName, lastUpdate } from "../utils/format";
import { track } from "../analytics";

type Tab = "criados" | "importados";

export function Borrowers() {
  useDocumentTitle("Mutuários");
  const { myBorrowers, importedBorrowers, removeImport } = useStore();
  const [params, setParams] = useSearchParams();
  const tab: Tab = params.get("aba") === "importados" ? "importados" : "criados";
  const [toRemove, setToRemove] = useState<Borrower | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const list = tab === "criados" ? myBorrowers : importedBorrowers;

  const confirmRemove = async (b: Borrower) => {
    setBusyId(b.id);
    await removeImport(b.id);
    track("import_removed");
    setBusyId(null);
  };

  return (
    <main className="main">
      <div className="page-head">
        <div>
          <Title>Mutuários</Title>
          <p className="subtitle">Os mutuários que registou e os que importou de outras instituições.</p>
        </div>
        <Link to="/pesquisar" className="btn btn--primary btn--md">
          <Plus size={20} />
          Novo mutuário
        </Link>
      </div>

      <Tabs<Tab>
        label="Lista de mutuários"
        style={{ marginTop: 32, maxWidth: 560 }}
        value={tab}
        onChange={(v) => setParams(v === "importados" ? { aba: "importados" } : {}, { replace: true })}
        options={[
          { value: "criados", label: `Criados · ${myBorrowers.length}` },
          { value: "importados", label: `Importados · ${importedBorrowers.length}` },
        ]}
      />

      {list.length === 0 ? (
        <p className="empty">
          Ops! Não existem mutuários.
          <br />
          {tab === "importados" ? (
            <Link to="/pesquisar">Pesquise um NUIT ou BI para importar</Link>
          ) : (
            <Link to="/pesquisar">Registe o primeiro mutuário</Link>
          )}
        </p>
      ) : (
        <div className="table-wrap" role="region" aria-label="Tabela de mutuários" tabIndex={0}>
          <div className="table" role="table">
            <div className="table__row table__head" role="row">
              <span role="columnheader">Mutuário</span>
              <span role="columnheader">Documento</span>
              <span role="columnheader">Estado</span>
              <span role="columnheader">Actualizado</span>
              <span role="columnheader" style={{ textAlign: "right" }}>
                Acções
              </span>
            </div>
            {list.map((b) => (
              <div className="table__row" role="row" key={b.id}>
                <span role="cell">
                  <PersonCell
                    borrower={b}
                    sub={tab === "importados" ? b.institution : b.nuit ? `NUIT ${b.nuit}` : "NUIT indisponível"}
                  />
                </span>
                <span role="cell" className="table__doc">
                  {b.docType}
                  <br />
                  <span>{b.docNumber}</span>
                </span>
                <span role="cell">
                  <StatusPill borrower={b} />
                </span>
                <span role="cell" className="table__date">
                  {formatDate(lastUpdate(b))}
                </span>
                <span role="cell" className="table__actions">
                  <Link to={`/mutuarios/${b.id}/status`} className="btn btn--primary btn--xs" aria-label={`Actualizar status de ${fullName(b)}`}>
                    <Redo size={16} />
                    Status
                  </Link>
                  {tab === "importados" && (
                    <button
                      type="button"
                      className="btn btn--danger btn--xs"
                      disabled={busyId === b.id}
                      onClick={() => setToRemove(b)}
                      aria-label={`Remover importação de ${fullName(b)}`}
                    >
                      {busyId === b.id ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <Trash size={16} />}
                      Remover
                    </button>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <AppAlert
        open={toRemove !== null}
        title="Remover importação"
        message={
          toRemove
            ? `${fullName(toRemove)} sai da sua lista de importados. Os dados e o histórico continuam com quem os criou.`
            : undefined
        }
        onClose={() => setToRemove(null)}
        actions={[
          { text: "Cancelar", style: "cancel" },
          { text: "Remover", style: "destructive", onPress: () => toRemove && confirmRemove(toRemove) },
        ]}
      />
    </main>
  );
}
