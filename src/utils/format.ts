import type { Borrower, StatusEntry, StatusType } from "../types";

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function parts(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return { y, m: Number(m), d };
}

/** 2026-10-08 → 08/10/2026 */
export function formatDate(iso?: string): string {
  if (!iso) return "—";
  const { y, m, d } = parts(iso);
  return `${d}/${String(m).padStart(2, "0")}/${y}`;
}

/** 2026-10-08 → 08 out 2026 */
export function formatShortDate(iso: string): string {
  const { y, m, d } = parts(iso);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function todayIso(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export const STATUS_COLORS: Record<StatusType, string> = {
  "Sem crédito": "#078C46",
  "Crédito em andamento": "#ffbc30",
  Devedor: "#fe5f58",
};

/** Cor usada quando o mutuário ainda não tem estado (titleColor do app). */
export const NO_STATUS_COLOR = "#0E104C";

export function latestStatus(b: Borrower): StatusEntry | undefined {
  return b.statuses[b.statuses.length - 1];
}

export function borrowerColor(b: Borrower): string {
  const s = latestStatus(b);
  return s ? STATUS_COLORS[s.type] : NO_STATUS_COLOR;
}

export function fullName(b: Borrower): string {
  return `${b.firstName} ${b.lastName}`.trim();
}

export function initials(b: Borrower): string {
  return `${b.firstName[0] ?? ""}${b.lastName[0] ?? ""}`.toUpperCase();
}

export function lastUpdate(b: Borrower): string {
  return latestStatus(b)?.date ?? b.createdAt;
}

export function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}
