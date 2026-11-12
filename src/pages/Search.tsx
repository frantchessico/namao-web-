import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppAlert } from "../components/AppAlert";
import { Avatar, StatusPill } from "../components/Borrower";
import { Download } from "../components/Icons";
import { Title, useDocumentTitle } from "../components/Layout";
import { SearchInput } from "../components/SearchInput";
import { Tabs } from "../components/Tabs";
import { useStore, type SearchResult } from "../store/AppStore";
import type { Borrower, SearchType } from "../types";
import { fullName } from "../utils/format";
import {
  BI_EXAMPLE,
  INVALID_BI_MESSAGE,
  INVALID_NUIT_MESSAGE,
  isValidBi,
  isValidNuit,
  normalizeBi,
  normalizeNuit,
} from "../utils/ids";

const LABEL: Record<SearchType, string> = { nuit: "NUIT", bi: "BI" };

export function Search() {
  useDocumentTitle("Pesquisar");
  const { searchType, setSearchType, search, isImported, importBorrower } = useStore();
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [notFound, setNotFound] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [importingId, setImportingId] = useState<string | null>(null);

  const isNuit = searchType === "nuit";
  const normalized = isNuit ? normalizeNuit(value) : normalizeBi(value);
  const valid = isNuit ? isValidNuit(normalized) : isValidBi(normalized);
  // O erro de formato aparece quando o campo já tem o comprimento máximo ou depois de tentar pesquisar.
  const showError = !valid && normalized.length > 0 && (touched || normalized.length >= (isNuit ? 9 : 13));

  const changeType = (t: SearchType) => {
    if (t === searchType) return;
    setSearchType(t);
    setValue("");
    setTouched(false);
    setResult(null);
  };

  const submit = async () => {
    setTouched(true);
    if (!valid) return;
    setLoading(true);
    setResult(null);
    try {
      const r = await search(searchType, normalized);
      if (r.results.length === 0) setNotFound(normalized);
      else setResult(r);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const doImport = async (b: Borrower) => {
    setImportingId(b.id);
    await importBorrower(b.id);
    setImportingId(null);
    navigate("/sucesso", {
      state: {
        title: "Importação",
        subtitle: "Completa!",
        message: "Agora você pode verificar o cadastro do seu mutuário!",
        next: `/mutuarios/${b.id}`,
        nextLabel: "Ver mutuário",
      },
    });
  };

  return (
    <main className="main main--narrow" style={{ paddingTop: 48 }}>
      <Title>Pesquisar</Title>
      <p className="subtitle">Consulte um mutuário pelo NUIT ou pelo número do BI. Se não existir, pode criar o cadastro.</p>

      <Tabs<SearchType>
        label="Pesquisar por"
        style={{ marginTop: 32 }}
        value={searchType}
        disabled={loading}
        onChange={changeType}
        options={[
          { value: "nuit", label: "NUIT" },
          { value: "bi", label: "BI" },
        ]}
      />

      <div style={{ marginTop: 20 }}>
        <SearchInput
          key={searchType}
          label={isNuit ? "NUIT do mutuário" : "Número do BI do mutuário"}
          placeholder={isNuit ? "Pesquisar NUIT" : "Pesquisar Nº do BI"}
          inputMode={isNuit ? "numeric" : "text"}
          autoCapitalize={isNuit ? "off" : "characters"}
          maxLength={isNuit ? 9 : 17}
          autoFocus
          value={isNuit ? normalized : value.toUpperCase()}
          onChange={(v) => {
            setValue(v);
            setResult(null);
          }}
          onSubmit={submit}
          searchDisabled={!valid}
          loading={loading}
          invalid={showError}
          describedBy="search-help"
        />
      </div>
      <p id="search-help" className={showError ? "field-error" : "hint"} style={{ margin: "10px 0 0 4px" }}>
        {showError
          ? isNuit
            ? INVALID_NUIT_MESSAGE
            : INVALID_BI_MESSAGE
          : isNuit
            ? "9 dígitos, só números."
            : `12 dígitos e 1 letra (ex.: ${BI_EXAMPLE}). Espaços e hífens são ignorados.`}
      </p>

      {loading && (
        <p className="result-label" role="status">
          A pesquisar mutuários com este {LABEL[searchType]}…
        </p>
      )}

      {result && (
        <section aria-live="polite">
          <p className="result-label">
            {result.results.length} {result.results.length === 1 ? "resultado" : "resultados"} · encontrado por {LABEL[result.matchedBy]}
          </p>
          {result.results.map((b) => {
            const mine = b.owner === "me";
            const imported = isImported(b.id);
            return (
              <div className="result" key={b.id}>
                <div className="person">
                  <Avatar borrower={b} />
                  <span className="person__text">
                    <span className="person__name">{fullName(b)}</span>
                    <span className="person__sub">
                      {b.docType === "Bilhete de Identidade" ? `BI ${b.docNumber}` : `${b.docType} ${b.docNumber}`}
                      {b.nuit ? ` · NUIT ${b.nuit}` : ""}
                    </span>
                    <span style={{ fontSize: 12, lineHeight: "18px", color: "var(--muted)" }}>Registado por {b.institution}</span>
                  </span>
                </div>
                <StatusPill borrower={b} />
                <div className="result__actions">
                  {mine && <span className="tag">Criado por si</span>}
                  {imported && <span className="tag">Importado</span>}
                  <Link to={`/mutuarios/${b.id}`} className="btn btn--light btn--sm">
                    Ver detalhes
                  </Link>
                  {!mine && !imported && (
                    <button type="button" className="btn btn--import btn--sm" disabled={importingId === b.id} onClick={() => doImport(b)}>
                      {importingId === b.id ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <Download size={16} />}
                      Importar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {!result && !loading && (
        <p className="empty" style={{ paddingTop: 72 }}>
          Pesquise pelo NUIT ou pelo BI para consultar ou criar um mutuário.
        </p>
      )}

      <AppAlert
        open={notFound !== null}
        title={`${LABEL[searchType]} não encontrado`}
        message={`Não existe mutuário com o ${LABEL[searchType]} ${notFound ?? ""}. Deseja criar um novo cadastro?`}
        onClose={() => setNotFound(null)}
        actions={[
          { text: "Cancelar", style: "cancel" },
          {
            text: "Criar cadastro",
            onPress: () => navigate("/mutuarios/novo", { state: isNuit ? { nuit: notFound } : { bi: notFound } }),
          },
        ]}
      />
      <AppAlert
        open={failed}
        title="Pesquisa"
        message={`Não foi possível pesquisar este ${LABEL[searchType]}. Tente novamente.`}
        onClose={() => setFailed(false)}
      />
    </main>
  );
}
