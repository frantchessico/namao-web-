import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout, RequireAuth } from "./components/Layout";
import { Account } from "./pages/Account";
import { Login } from "./pages/auth/Login";
import { LoginCode } from "./pages/auth/LoginCode";
import { Terms } from "./pages/auth/Terms";
import { Borrowers } from "./pages/Borrowers";
import { DeleteAccount } from "./pages/DeleteAccount";
import { Details } from "./pages/Details";
import { Notifications } from "./pages/Notifications";
import { Register } from "./pages/Register";
import { Search } from "./pages/Search";
import { StatusModal } from "./pages/StatusModal";
import { Success } from "./pages/Success";
import { AppStoreProvider, useStore } from "./store/AppStore";
import { track } from "./analytics";

/** Faixa discreta para repor os dados de exemplo durante testes. */
function PrototypeBar() {
  const { resetDemo } = useStore();
  return (
    <div className="proto-bar" role="note">
      Protótipo · dados simulados
      <button
        type="button"
        onClick={() => {
          track("demo_reset");
          resetDemo();
          window.location.assign("/mutuarios");
        }}
      >
        Repor dados
      </button>
    </div>
  );
}

export function App() {
  return (
    <AppStoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/entrar" element={<Login />} />
          <Route path="/entrar/codigo" element={<LoginCode />} />
          <Route path="/termos" element={<Terms />} />

          <Route element={<RequireAuth />}>
            <Route path="/sucesso" element={<Success />} />
            <Route element={<AppLayout />}>
              <Route path="/mutuarios" element={<Borrowers />} />
              <Route path="/mutuarios/novo" element={<Register />} />
              <Route path="/mutuarios/:id" element={<Details />}>
                <Route path="status" element={<StatusModal />} />
              </Route>
              <Route path="/pesquisar" element={<Search />} />
              <Route path="/notificacoes" element={<Notifications />} />
              <Route path="/conta" element={<Account />} />
              <Route path="/conta/eliminar" element={<DeleteAccount />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/mutuarios" replace />} />
        </Routes>
        <PrototypeBar />
      </BrowserRouter>
    </AppStoreProvider>
  );
}
