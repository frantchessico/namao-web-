import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { TextField } from "../../components/Fields";
import { Title, useDocumentTitle } from "../../components/Layout";
import { useStore } from "../../store/AppStore";
import { isValidEmail } from "../../utils/ids";
import { AuthBrand } from "./AuthBrand";

export function Login() {
  useDocumentTitle("Entrar");
  const { requestCode, isLoggedIn, auth } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState(auth.pendingEmail ?? "");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) return <Navigate to="/mutuarios" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return setError("Insira o email do funcionário para receber o código.");
    if (!isValidEmail(email)) return setError("Email inválido");
    setError(undefined);
    setLoading(true);
    await requestCode(email);
    setLoading(false);
    navigate("/entrar/codigo");
  };

  return (
    <div className="auth">
      <AuthBrand />
      <section className="auth__panel">
        <form className="auth__form" onSubmit={submit} noValidate>
          <Title>Entrar</Title>
          <p className="subtitle" style={{ marginBottom: 32 }}>
            Entre com o email do funcionário para receber um código.
          </p>
          <TextField
            label="Email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            autoFocus
            value={email}
            error={error}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(undefined);
            }}
          />
          <button type="submit" className="btn btn--primary btn--block" style={{ marginTop: 32 }} disabled={loading}>
            {loading && <span className="spinner" />}
            Enviar código
          </button>
          <p style={{ margin: "24px 0 0", fontSize: 13, lineHeight: "20px", color: "var(--text-2)", textAlign: "center" }}>
            Ao entrar aceita os <Link to="/termos">termos e condições</Link> da plataforma namao.
          </p>
        </form>
      </section>
    </div>
  );
}
