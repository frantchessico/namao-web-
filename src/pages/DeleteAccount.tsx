import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AppAlert } from "../components/AppAlert";
import { TextField } from "../components/Fields";
import { ArrowLeft } from "../components/Icons";
import { Title, useDocumentTitle } from "../components/Layout";
import { delay, useStore } from "../store/AppStore";
import { track } from "../analytics";

export function DeleteAccount() {
  useDocumentTitle("Eliminar conta");
  const { user, deleteAccount } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const accountEmail = user?.email ?? "";
  const matches = email.trim().toLowerCase() === accountEmail;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (matches) setConfirming(true);
  };

  const doDelete = async () => {
    setSubmitting(true);
    await delay(800);
    track("account_deleted");
    deleteAccount();
    navigate("/entrar", { replace: true });
  };

  return (
    <main className="main" style={{ maxWidth: 880 }}>
      <div className="page-head page-head--back">
        <button type="button" className="icon-btn" aria-label="Voltar" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <div>
          <Title>Eliminar conta</Title>
          <p className="subtitle" style={{ marginTop: 0 }}>
            Antes de continuar, leia o que acontece aos dados.
          </p>
        </div>
      </div>

      <div className="cards-2" style={{ marginTop: 32 }}>
        <section className="card card--danger">
          <h2>É eliminado</h2>
          <ul>
            <li>O seu acesso à aplicação</li>
            <li>O seu nome e o seu email</li>
            <li>O registo dos seus acessos</li>
            <li>A sua lista de mutuários importados</li>
          </ul>
        </section>
        <section className="card">
          <h2>Permanece na plataforma</h2>
          <ul>
            <li>Os mutuários que registou, as avaliações de status e os empréstimos</li>
          </ul>
          <p>
            Estes registos são de terceiros e pertencem à instituição de microcrédito onde trabalha, que responde por eles
            perante a lei. Deixam de estar ligados ao seu nome.
          </p>
        </section>
      </div>

      <form onSubmit={submit} noValidate style={{ marginTop: 32, paddingTop: 32, borderTop: "1px solid var(--divider)", display: "flex", flexDirection: "column" }}>
        <TextField
          label={
            <>
              Para confirmar, escreva o email da sua conta: <b style={{ fontWeight: 700 }}>{accountEmail}</b>
            </>
          }
          type="email"
          placeholder="Escreva o seu email"
          autoComplete="off"
          value={email}
          disabled={submitting}
          onChange={(e) => setEmail(e.target.value)}
          hint={email && !matches ? "O email não coincide com o da conta." : undefined}
        />
        <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 12 }}>
          <button type="submit" className="btn btn--danger" style={{ flex: "1 1 280px" }} disabled={!matches || submitting}>
            {submitting && <span className="spinner" />}
            Eliminar a minha conta
          </button>
          <button type="button" className="btn btn--ghost" style={{ flex: "1 1 220px", fontSize: 16 }} disabled={submitting} onClick={() => navigate("/conta")}>
            Manter a minha conta
          </button>
        </div>
      </form>

      <AppAlert
        open={confirming}
        title="Eliminar conta"
        message="Esta acção não pode ser desfeita. Quer mesmo eliminar a sua conta?"
        onClose={() => setConfirming(false)}
        actions={[
          { text: "Cancelar", style: "cancel" },
          { text: "Eliminar", style: "destructive", onPress: doDelete },
        ]}
      />
    </main>
  );
}
