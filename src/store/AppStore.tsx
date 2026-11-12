import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { MOCK_USER, MY_INSTITUTION, SEED_BORROWERS, SEED_IMPORTED } from "../data/mock";
import type { Borrower, SearchType, StatusEntry, User } from "../types";
import { newId, todayIso } from "../utils/format";
import { normalizeBi, normalizeNuit } from "../utils/ids";

/**
 * Estado do protótipo. Substitui a API: tudo vive em memória e é guardado no
 * localStorage para sobreviver a um refresh. Cada acção corresponde a um
 * endpoint do back-end (indicado no comentário) para facilitar a integração.
 */

type Auth = {
  pendingEmail: string | null;
  email: string | null;
  termsAccepted: boolean;
};

type State = {
  auth: Auth;
  borrowers: Borrower[];
  importedIds: string[];
  searchType: SearchType;
};

// v2: todos os mutuários passam a ter pelo menos um estado (a v1 tinha mutuários sem estado).
const STORAGE_KEY = "namao-web-prototype-v2";

function initialState(): State {
  return {
    auth: { pendingEmail: null, email: null, termsAccepted: false },
    borrowers: SEED_BORROWERS,
    importedIds: SEED_IMPORTED,
    searchType: "nuit",
  };
}

function loadState(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...initialState(), ...(JSON.parse(raw) as State) };
  } catch {
    // localStorage indisponível (janela privada, etc.): começa do zero.
  }
  return initialState();
}

/** Latência simulada para os estados de carregamento serem visíveis. */
export const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

/** Um mutuário nunca é criado sem estado: o cadastro traz sempre o estado inicial. */
export type NewBorrower = Omit<Borrower, "id" | "owner" | "institution" | "registeredBy" | "createdAt" | "statuses"> & {
  initialStatus: Pick<StatusEntry, "type" | "note">;
};

export type SearchResult = { matchedBy: SearchType; results: Borrower[] };

type Store = State & {
  user: User | null;
  isLoggedIn: boolean;
  myBorrowers: Borrower[];
  importedBorrowers: Borrower[];
  getBorrower: (id: string) => Borrower | undefined;
  isImported: (id: string) => boolean;
  requestCode: (email: string) => Promise<void>;
  confirmLogin: () => void;
  acceptTerms: () => void;
  logout: () => void;
  deleteAccount: () => void;
  setSearchType: (t: SearchType) => void;
  search: (type: SearchType, value: string) => Promise<SearchResult>;
  findDuplicate: (data: { nuit?: string; docType: string; docNumber: string }) => Borrower | undefined;
  createBorrower: (data: NewBorrower) => Promise<Borrower>;
  addStatus: (borrowerId: string, entry: Omit<StatusEntry, "id" | "institution">) => Promise<void>;
  importBorrower: (id: string) => Promise<void>;
  removeImport: (id: string) => Promise<void>;
  resetDemo: () => void;
};

const StoreContext = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignora: o protótipo continua a funcionar só em memória
    }
  }, [state]);

  const getBorrower = useCallback((id: string) => state.borrowers.find((b) => b.id === id), [state.borrowers]);
  const isImported = useCallback((id: string) => state.importedIds.includes(id), [state.importedIds]);

  // POST /auth/code
  const requestCode = useCallback(async (email: string) => {
    await delay(600);
    setState((s) => ({ ...s, auth: { ...s.auth, pendingEmail: email.trim().toLowerCase() } }));
  }, []);

  // POST /auth/verify
  const confirmLogin = useCallback(() => {
    setState((s) => ({ ...s, auth: { ...s.auth, email: s.auth.pendingEmail, pendingEmail: null } }));
  }, []);

  const acceptTerms = useCallback(() => {
    setState((s) => ({ ...s, auth: { ...s.auth, termsAccepted: true } }));
  }, []);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, auth: { ...s.auth, email: null, pendingEmail: null } }));
  }, []);

  // DELETE /account — os mutuários registados ficam; os importados e o acesso saem.
  const deleteAccount = useCallback(() => {
    setState((s) => ({
      ...s,
      auth: { pendingEmail: null, email: null, termsAccepted: false },
      importedIds: [],
    }));
  }, []);

  const setSearchType = useCallback((t: SearchType) => setState((s) => ({ ...s, searchType: t })), []);

  // POST /borrowers/search { type, value }
  const search = useCallback(
    async (type: SearchType, value: string): Promise<SearchResult> => {
      await delay(700);
      const results =
        type === "nuit"
          ? state.borrowers.filter((b) => b.nuit && b.nuit === normalizeNuit(value))
          : state.borrowers.filter(
              (b) => b.docType === "Bilhete de Identidade" && normalizeBi(b.docNumber) === normalizeBi(value)
            );
      return { matchedBy: type, results };
    },
    [state.borrowers]
  );

  const findDuplicate = useCallback(
    (data: { nuit?: string; docType: string; docNumber: string }) =>
      state.borrowers.find(
        (b) =>
          (data.nuit && b.nuit === data.nuit) ||
          (b.docType === data.docType && normalizeBi(b.docNumber) === normalizeBi(data.docNumber))
      ),
    [state.borrowers]
  );

  // POST /borrowers seguido de POST /status (o app faz o mesmo: Cadastro → Status)
  const createBorrower = useCallback(async ({ initialStatus, ...data }: NewBorrower) => {
    await delay(700);
    const today = todayIso();
    const borrower: Borrower = {
      ...data,
      id: newId("b"),
      owner: "me",
      institution: MY_INSTITUTION,
      registeredBy: MOCK_USER.name,
      createdAt: today,
      statuses: [
        {
          ...initialStatus,
          id: newId("s"),
          date: data.contractDate && data.contractDate <= today ? data.contractDate : today,
          institution: MY_INSTITUTION,
        },
      ],
    };
    setState((s) => ({ ...s, borrowers: [borrower, ...s.borrowers] }));
    return borrower;
  }, []);

  // POST /status
  const addStatus = useCallback(async (borrowerId: string, entry: Omit<StatusEntry, "id" | "institution">) => {
    await delay(700);
    setState((s) => ({
      ...s,
      borrowers: s.borrowers.map((b) =>
        b.id === borrowerId
          ? {
              ...b,
              statuses: [...b.statuses, { ...entry, id: newId("s"), institution: MY_INSTITUTION }].sort((x, y) =>
                x.date.localeCompare(y.date)
              ),
            }
          : b
      ),
    }));
  }, []);

  // POST /borrowers/requests/:borrower
  const importBorrower = useCallback(async (id: string) => {
    await delay(600);
    setState((s) => (s.importedIds.includes(id) ? s : { ...s, importedIds: [id, ...s.importedIds] }));
  }, []);

  // DELETE /borrowers/requests/:borrower
  const removeImport = useCallback(async (id: string) => {
    await delay(500);
    setState((s) => ({ ...s, importedIds: s.importedIds.filter((x) => x !== id) }));
  }, []);

  const resetDemo = useCallback(() => {
    setState((s) => ({ ...initialState(), auth: s.auth }));
  }, []);

  const value = useMemo<Store>(() => {
    const email = state.auth.email;
    return {
      ...state,
      user: email ? { ...MOCK_USER, email } : null,
      isLoggedIn: Boolean(email),
      myBorrowers: state.borrowers.filter((b) => b.owner === "me"),
      importedBorrowers: state.importedIds
        .map((id) => state.borrowers.find((b) => b.id === id))
        .filter((b): b is Borrower => Boolean(b)),
      getBorrower,
      isImported,
      requestCode,
      confirmLogin,
      acceptTerms,
      logout,
      deleteAccount,
      setSearchType,
      search,
      findDuplicate,
      createBorrower,
      addStatus,
      importBorrower,
      removeImport,
      resetDemo,
    };
  }, [
    state,
    getBorrower,
    isImported,
    requestCode,
    confirmLogin,
    acceptTerms,
    logout,
    deleteAccount,
    setSearchType,
    search,
    findDuplicate,
    createBorrower,
    addStatus,
    importBorrower,
    removeImport,
    resetDemo,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore fora do AppStoreProvider");
  return ctx;
}
