import { useRef, useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Title, useDocumentTitle } from "../../components/Layout";
import { INVALID_DEMO_CODE } from "../../data/mock";
import { delay, useStore } from "../../store/AppStore";
import { AuthBrand } from "./AuthBrand";
import { track } from "../../analytics";

const LENGTH = 6;

export function LoginCode() {
  useDocumentTitle("Código");
  const { auth, confirmLogin, requestCode, isLoggedIn } = useStore();
  const navigate = useNavigate();
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const [loading, setLoading] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  if (isLoggedIn) return <Navigate to="/mutuarios" replace />;
  if (!auth.pendingEmail) return <Navigate to="/entrar" replace />;

  const code = digits.join("");

  const setAt = (i: number, value: string) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length > 1) {
      // colar o código inteiro
      const next = clean.slice(0, LENGTH).split("");
      setDigits(Array.from({ length: LENGTH }, (_, k) => next[k] ?? ""));
      refs.current[Math.min(next.length, LENGTH - 1)]?.focus();
    } else {
      setDigits((d) => d.map((x, k) => (k === i ? clean : x)));
      if (clean && i < LENGTH - 1) refs.current[i + 1]?.focus();
    }
    setError(undefined);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (code.length !== LENGTH) return setError("Insira o código de 6 dígitos enviado ao email.");
    setLoading(true);
    await delay(600);
    setLoading(false);
    if (code === INVALID_DEMO_CODE) {
      setError("Código inválido");
      track("login_code_invalid");
      return;
    }
    track("login_completed", { first_access: !auth.termsAccepted });
    confirmLogin();
    navigate(auth.termsAccepted ? "/mutuarios" : "/termos", { replace: true });
  };

  const resend = async () => {
    await requestCode(auth.pendingEmail ?? "");
    track("login_code_resent");
    setNotice("Enviámos um novo código para o seu email.");
  };

  return (
    <div className="auth">
      <AuthBrand />
      <section className="auth__panel">
        <form className="auth__form" onSubmit={submit} noValidate>
          <Title>Código</Title>
          <p className="subtitle">Código enviado para</p>
          <p style={{ margin: "0 0 32px", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "baseline" }}>
            <b style={{ fontFamily: "var(--font-title)", fontSize: 15 }}>{auth.pendingEmail}</b>
            <button type="button" className="btn btn--link" style={{ fontSize: 13, padding: 0 }} onClick={() => navigate("/entrar")}>
              Usar outro email
            </button>
          </p>

          <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
            <legend className="field__label" style={{ padding: 0, marginBottom: 8 }}>
              Insira o código de 6 dígitos enviado ao email.
            </legend>
            <div className="otp">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  className="input"
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  aria-label={`Dígito ${i + 1}`}
                  aria-invalid={error ? true : undefined}
                  autoFocus={i === 0}
                  value={d}
                  maxLength={i === 0 ? LENGTH : 1}
                  onChange={(e) => setAt(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !d && i > 0) refs.current[i - 1]?.focus();
                  }}
                />
              ))}
            </div>
          </fieldset>
          {error && (
            <p className="field-error" role="alert" style={{ marginTop: 8 }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn btn--primary btn--block" style={{ marginTop: 32 }} disabled={loading || code.length !== LENGTH}>
            {loading && <span className="spinner" />}
            Entrar
          </button>
          <button type="button" className="btn btn--link" style={{ marginTop: 12, alignSelf: "center" }} onClick={resend}>
            Reenviar código
          </button>
          {notice && (
            <p className="notice" role="status" style={{ marginTop: 8 }}>
              {notice}
            </p>
          )}
          <p className="notice" style={{ marginTop: 24 }}>
            Protótipo: qualquer código de 6 dígitos entra. Use {INVALID_DEMO_CODE} para ver o erro.
          </p>
        </form>
      </section>
    </div>
  );
}
