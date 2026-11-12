import { track as vercelTrack, type BeforeSendEvent } from "@vercel/analytics/react";
import type { DocType, SearchType, StatusType } from "./types";

/**
 * Analytics do protótipo (Vercel Web Analytics: sem cookies, sem dados pessoais).
 *
 * Regra: nunca enviar NUIT, BI, nomes, emails, telefones nem ids de mutuários.
 * Só se enviam categorias (tipo de pesquisa, tipo de estado, resultado...).
 * Todos os eventos estão tipados aqui, para o catálogo ficar num só sítio.
 */
export type AnalyticsEvents = {
  login_code_requested: Record<string, never>;
  login_code_resent: Record<string, never>;
  login_completed: { first_access: boolean };
  login_code_invalid: Record<string, never>;
  terms_accepted: Record<string, never>;
  logout: Record<string, never>;
  account_deleted: Record<string, never>;
  search_type_changed: { type: SearchType };
  search_invalid_format: { type: SearchType };
  search_performed: { type: SearchType; outcome: "mine" | "other_institution" | "not_found"; results: number };
  search_failed: { type: SearchType };
  register_started: { from: SearchType };
  register_validation_failed: { fields: number };
  register_duplicate: { from: SearchType };
  register_cancelled: { from: SearchType };
  borrower_created: { from: SearchType; doc_type: DocType; status: StatusType; has_email: boolean };
  status_added: { status: StatusType; changed: boolean };
  borrower_imported: { from: "search" | "details" };
  import_removed: Record<string, never>;
  demo_reset: Record<string, never>;
};

export function track<E extends keyof AnalyticsEvents>(event: E, ...props: AnalyticsEvents[E] extends Record<string, never> ? [] : [AnalyticsEvents[E]]) {
  const properties = props[0] as Record<string, string | number | boolean> | undefined;
  if (import.meta.env.DEV) console.debug("[analytics]", event, properties ?? {});
  try {
    vercelTrack(event, properties);
  } catch {
    // Analytics nunca pode partir a app.
  }
}

/** Ids de mutuários não saem do browser: /mutuarios/b_ana → /mutuarios/[id]. */
export function scrubUrl(url: string): string {
  const u = new URL(url);
  u.pathname = u.pathname.replace(/^\/mutuarios\/(?!novo(?:\/|$))[^/]+/, "/mutuarios/[id]");
  // Só a aba é útil; outros parâmetros podem trazer dados escritos pelo utilizador.
  const aba = u.searchParams.get("aba");
  u.search = aba ? `?aba=${encodeURIComponent(aba)}` : "";
  u.hash = "";
  return u.toString();
}

export function beforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
  try {
    if (localStorage.getItem("namao-analytics-optout") === "1") return null;
  } catch {
    // sem localStorage: segue
  }
  return { ...event, url: scrubUrl(event.url) };
}
