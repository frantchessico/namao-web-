import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppAlert } from "../components/AppAlert";
import { DateField, SelectField, TextAreaField, TextField } from "../components/Fields";
import { ArrowLeft } from "../components/Icons";
import { Title, useDocumentTitle } from "../components/Layout";
import { useStore } from "../store/AppStore";
import { DOC_TYPES, GENDERS, STATUS_TYPES, type DocType, type Gender, type StatusType } from "../types";
import { fullName, todayIso } from "../utils/format";
import {
  INVALID_BI_MESSAGE,
  isValidBi,
  isValidEmail,
  isValidNuit,
  isValidPhone,
  normalizeBi,
  normalizeNuit,
  normalizePhone,
} from "../utils/ids";
import { track } from "../analytics";

type Form = {
  firstName: string;
  lastName: string;
  gender: Gender | "";
  docType: DocType | "";
  docNumber: string;
  nuit: string;
  contractDate: string;
  statusType: StatusType | "";
  statusNote: string;
  address: string;
  phone: string;
  email: string;
};

type Errors = Partial<Record<keyof Form, string>>;

/** Mesmas regras de back-end/src/middlewares/validators/Borrowers.validators.ts. */
function validate(f: Form): Errors {
  const e: Errors = {};
  const first = f.firstName.trim();
  const last = f.lastName.trim();
  if (!first) e.firstName = "O primeiro nome é obrigatório";
  else if (first.length < 3) e.firstName = "Mínimo 3 caracteres";
  if (!last) e.lastName = "O último nome é obrigatório";
  else if (last.length < 3) e.lastName = "Mínimo 3 caracteres";
  if (!f.gender) e.gender = "Selecione o tipo de gênero.";
  if (!f.docType) e.docType = "Selecione o tipo de documento.";
  if (!f.docNumber.trim()) e.docNumber = "O número do documento é obrigatório";
  else if (f.docNumber.trim().length < 3) e.docNumber = "Mínimo 3 caracteres";
  else if (f.docType === "Bilhete de Identidade" && !isValidBi(f.docNumber)) e.docNumber = INVALID_BI_MESSAGE;
  if (f.nuit && !isValidNuit(f.nuit)) e.nuit = "O NUIT deve ter exatamente 9 dígitos";
  // Mesmas regras do ecrã de Status do app: todo o mutuário entra com um estado.
  if (!f.statusType) e.statusType = "Selecione o tipo de estado.";
  if (!f.statusNote.trim()) e.statusNote = "Observação obrigatória";
  else if (f.statusNote.trim().length < 6)
    e.statusNote = "A observação é demasiado curta. Descreva o motivo com pelo menos 6 caracteres.";
  if (!f.address.trim()) e.address = "O endereço é obrigatório";
  else if (f.address.trim().length < 3) e.address = "Mínimo 3 caracteres";
  if (!f.phone.trim()) e.phone = "O número de telefone é obrigatório";
  else if (!isValidPhone(f.phone)) e.phone = "Número de telefone inválido";
  if (f.email && !isValidEmail(f.email)) e.email = "Email inválido";
  return e;
}

export function Register() {
  useDocumentTitle("Cadastro");
  const { createBorrower, findDuplicate } = useStore();
  const navigate = useNavigate();
  const routeState = (useLocation().state ?? {}) as { nuit?: string; bi?: string };
  const verifiedNuit = routeState.nuit ? normalizeNuit(routeState.nuit) : undefined;
  const verifiedBi = routeState.bi ? normalizeBi(routeState.bi) : undefined;

  const [form, setForm] = useState<Form>({
    firstName: "",
    lastName: "",
    gender: "",
    docType: verifiedBi ? "Bilhete de Identidade" : "",
    docNumber: verifiedBi ?? "",
    nuit: verifiedNuit ?? "",
    contractDate: todayIso(),
    statusType: "",
    statusNote: "",
    address: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [alert, setAlert] = useState<{ title: string; message: string } | null>(null);
  const from = verifiedBi ? "bi" : "nuit";

  useEffect(() => {
    if (verifiedNuit || verifiedBi) track("register_started", { from });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // O cadastro começa sempre por uma pesquisa (como no app): sem identificador verificado, volta-se à pesquisa.
  if (!verifiedNuit && !verifiedBi) {
    return (
      <main className="main main--narrow">
        <Title>Cadastro</Title>
        <p className="banner" style={{ marginTop: 24 }}>
          Para registar um mutuário, pesquise primeiro o NUIT ou o BI para confirmar que ainda não existe.
        </p>
        <Link to="/pesquisar" className="btn btn--primary btn--md" style={{ marginTop: 24 }}>
          Ir para a pesquisa
        </Link>
      </main>
    );
  }

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    const next = { ...form, [key]: value };
    setForm(next);
    if (submitted) setErrors(validate(next));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      track("register_validation_failed", { fields: Object.keys(errs).length });
      setAlert({ title: "Dados incompletos", message: "Corrija os campos assinalados antes de continuar." });
      return;
    }
    const docNumber = form.docType === "Bilhete de Identidade" ? normalizeBi(form.docNumber) : form.docNumber.trim();
    const nuit = form.nuit ? normalizeNuit(form.nuit) : undefined;
    const dup = findDuplicate({ nuit, docType: form.docType, docNumber });
    if (dup) {
      track("register_duplicate", { from });
      setAlert({
        title: "Mutuário já existe",
        message: `${fullName(dup)} já está registado com este ${dup.nuit === nuit ? "NUIT" : "documento"}.`,
      });
      return;
    }
    setSaving(true);
    const b = await createBorrower({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      gender: form.gender as Gender,
      docType: form.docType as DocType,
      docNumber,
      nuit,
      phone: normalizePhone(form.phone),
      address: form.address.trim(),
      email: form.email.trim() || undefined,
      contractDate: form.contractDate || undefined,
      initialStatus: { type: form.statusType as StatusType, note: form.statusNote.trim() },
    });
    setSaving(false);
    track("borrower_created", {
      from,
      doc_type: form.docType as DocType,
      status: form.statusType as StatusType,
      has_email: Boolean(form.email.trim()),
    });
    navigate("/sucesso", {
      replace: true,
      state: {
        title: "Cadastro",
        subtitle: "Concluído!",
        message: `${fullName(b)} já faz parte dos seus mutuários.`,
        next: `/mutuarios/${b.id}`,
        nextLabel: "Ver mutuário",
      },
    });
  };

  const biLocked = Boolean(verifiedBi);

  return (
    <main className="main main--form">
      <div className="page-head page-head--back">
        <button type="button" className="icon-btn" aria-label="Voltar" onClick={() => setConfirmCancel(true)}>
          <ArrowLeft />
        </button>
        <div style={{ flex: "1 1 300px" }}>
          <Title>Cadastro</Title>
          <p className="subtitle" style={{ marginTop: 0 }}>
            Preencha o formulário com os dados do mutuário.
          </p>
        </div>
        <div className="verified">
          <small>{verifiedBi ? "BI verificado" : "NUIT verificado"}</small>
          <b>{verifiedBi ?? verifiedNuit}</b>
        </div>
      </div>

      <form onSubmit={submit} noValidate style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 40 }}>
        <section className="form-section">
          <Title as="h2">Identificação</Title>
          <div className="form-grid">
            <TextField label="Primeiro nome" autoComplete="off" value={form.firstName} error={errors.firstName} onChange={(e) => set("firstName", e.target.value)} />
            <TextField label="Último nome" autoComplete="off" value={form.lastName} error={errors.lastName} onChange={(e) => set("lastName", e.target.value)} />
            <SelectField label="Género" placeholder="Tipo de gênero" options={GENDERS} value={form.gender} error={errors.gender} onChange={(e) => set("gender", e.target.value as Gender)} />
            {biLocked ? (
              <TextField label="Tipo de documento" value="Bilhete de Identidade" readOnly hint="Definido pela pesquisa por BI." />
            ) : (
              <SelectField label="Tipo de documento" placeholder="Tipo de Documento" options={DOC_TYPES} value={form.docType} error={errors.docType} onChange={(e) => set("docType", e.target.value as DocType)} />
            )}
            <TextField
              label="Número do documento"
              placeholder={form.docType === "Bilhete de Identidade" ? "Ex.: 110100123456A" : "Documento"}
              value={form.docNumber}
              readOnly={biLocked}
              error={errors.docNumber}
              onChange={(e) => set("docNumber", form.docType === "Bilhete de Identidade" ? e.target.value.toUpperCase() : e.target.value)}
            />
            {verifiedNuit ? (
              <TextField label="NUIT" value={verifiedNuit} readOnly hint="Verificado na pesquisa." />
            ) : (
              <TextField
                label={
                  <>
                    NUIT <small>(opcional)</small>
                  </>
                }
                placeholder="9 dígitos"
                inputMode="numeric"
                maxLength={9}
                value={form.nuit}
                error={errors.nuit}
                onChange={(e) => set("nuit", normalizeNuit(e.target.value))}
              />
            )}
          </div>
        </section>

        <section className="form-section">
          <Title as="h2">Contrato</Title>
          <div className="form-grid">
            <DateField label="Data de contrato" placeholder="Data de Contrato" max={todayIso()} value={form.contractDate} onChange={(e) => set("contractDate", e.target.value)} />
          </div>
        </section>

        <section className="form-section">
          <div style={{ flex: "1 1 200px" }}>
            <Title as="h2">Estado</Title>
            <p className="subtitle" style={{ marginTop: -12 }}>
              Todo o mutuário entra com um estado. Fica registado na data de contrato.
            </p>
          </div>
          <div className="form-grid">
            <SelectField
              label="Tipo de estado"
              placeholder="Tipo de estado"
              options={STATUS_TYPES}
              value={form.statusType}
              error={errors.statusType}
              onChange={(e) => set("statusType", e.target.value as StatusType)}
            />
            <TextAreaField
              className="span-2"
              label="Observação"
              placeholder="Observação (motivo da alteração)"
              value={form.statusNote}
              error={errors.statusNote}
              onChange={(e) => set("statusNote", e.target.value)}
            />
          </div>
        </section>

        <section className="form-section">
          <Title as="h2">Contacto</Title>
          <div className="form-grid">
            <TextField className="span-2" label="Endereço" placeholder="Bairro, rua, número" value={form.address} error={errors.address} onChange={(e) => set("address", e.target.value)} />
            <TextField label="Telefone" placeholder="84 000 0000" inputMode="tel" autoComplete="off" value={form.phone} error={errors.phone} onChange={(e) => set("phone", e.target.value)} />
            <TextField
              label={
                <>
                  Email <small>(opcional)</small>
                </>
              }
              type="email"
              placeholder="Email"
              autoComplete="off"
              value={form.email}
              error={errors.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
        </section>

        <div className="form-actions">
          <button type="button" className="btn btn--light" style={{ fontSize: 16 }} onClick={() => setConfirmCancel(true)}>
            Cancelar cadastro
          </button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving && <span className="spinner" />}
            Continuar
          </button>
        </div>
      </form>

      <AppAlert
        open={confirmCancel}
        title="Cancelar cadastro"
        message="Os dados preenchidos não serão guardados."
        onClose={() => setConfirmCancel(false)}
        actions={[
          { text: "Continuar a editar", style: "cancel" },
          {
            text: "Cancelar",
            style: "destructive",
            onPress: () => {
              track("register_cancelled", { from });
              navigate("/mutuarios");
            },
          },
        ]}
      />
      <AppAlert open={alert !== null} title={alert?.title ?? ""} message={alert?.message} onClose={() => setAlert(null)} />
    </main>
  );
}
