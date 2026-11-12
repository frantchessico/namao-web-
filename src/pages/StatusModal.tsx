import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppAlert } from "../components/AppAlert";
import { DateField, SelectField, TextAreaField } from "../components/Fields";
import { Close } from "../components/Icons";
import { Title } from "../components/Layout";
import { EXIT_MS, prefersReducedMotion } from "../hooks/usePresence";
import { useStore } from "../store/AppStore";
import { STATUS_TYPES, type StatusType } from "../types";
import { fullName, todayIso } from "../utils/format";

/** Modal "Status." aberto por cima dos Detalhes (rota /mutuarios/:id/status). */
export function StatusModal() {
  const { id = "" } = useParams();
  const { getBorrower, addStatus } = useStore();
  const navigate = useNavigate();
  const titleId = useId();
  const b = getBorrower(id);

  const [type, setType] = useState<StatusType | "">("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayIso());
  const [errors, setErrors] = useState<{ type?: string; note?: string; date?: string }>({});
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);
  // Anima a saída e só depois sai da rota do modal.
  const close = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    if (prefersReducedMotion()) return navigate(`/mutuarios/${id}`, { replace: true });
    setClosing(true);
    window.setTimeout(() => navigate(`/mutuarios/${id}`, { replace: true }), EXIT_MS);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  if (!b) return null;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!type) errs.type = "Selecione o tipo de estado.";
    if (!note.trim()) errs.note = "Observação obrigatória";
    else if (note.trim().length < 6) errs.note = "A observação é demasiado curta. Descreva o motivo com pelo menos 6 caracteres.";
    if (!date) errs.date = "Indique a data do estado.";
    else if (date > todayIso()) errs.date = "A data não pode ser no futuro.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    try {
      await addStatus(b.id, { type: type as StatusType, note: note.trim(), date });
      navigate("/sucesso", {
        replace: true,
        state: {
          title: "Status",
          subtitle: "Actualizado!",
          message: `O estado de ${fullName(b)} passou a «${type}».`,
          next: `/mutuarios/${b.id}`,
          nextLabel: "Ver mutuário",
        },
      });
    } catch {
      setFailed(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`overlay${closing ? " is-closing" : ""}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="modal__close">
          <button type="button" className="icon-btn icon-btn--plain" aria-label="Fechar" onClick={close}>
            <Close />
          </button>
        </div>
        <div id={titleId}>
          <Title>Status</Title>
        </div>
        <p className="subtitle" style={{ maxWidth: 320, marginBottom: 28 }}>
          Actualize o estado de {fullName(b)} e controle o seu progresso.
        </p>
        <form onSubmit={submit} noValidate style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SelectField
            label="Tipo de estado"
            placeholder="Tipo de estado"
            options={STATUS_TYPES}
            value={type}
            error={errors.type}
            autoFocus
            onChange={(e) => setType(e.target.value as StatusType)}
          />
          <TextAreaField
            label="Observação"
            placeholder="Observação (motivo da alteração)"
            value={note}
            error={errors.note}
            onChange={(e) => setNote(e.target.value)}
          />
          <DateField label="Data do estado" placeholder="Data do estado" max={todayIso()} value={date} error={errors.date} onChange={(e) => setDate(e.target.value)} />
          <button type="submit" className="btn btn--primary btn--block" style={{ marginTop: 20 }} disabled={saving}>
            {saving && <span className="spinner" />}
            Actualizar o status
          </button>
        </form>
      </div>
      <AppAlert open={failed} title="Status" message="Não foi possível atualizar o estado. Tente novamente." onClose={() => setFailed(false)} />
    </div>
  );
}
