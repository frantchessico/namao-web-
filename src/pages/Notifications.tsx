import { Title, useDocumentTitle } from "../components/Layout";

export function Notifications() {
  useDocumentTitle("Notificações");
  return (
    <main className="main">
      <Title>Notificações</Title>
      <p className="empty">Ops! Você ainda não tem notificações.</p>
    </main>
  );
}
