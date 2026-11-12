// Regras de identificação partilhadas com o app (sgm-app/src/utils/nuit.ts)
// e com a proposta de pesquisa por BI.

export const NUIT_REGEX = /^\d{9}$/;
export const BI_REGEX = /^\d{12}[A-Z]$/;

export const BI_EXAMPLE = "110100123456A";

export const INVALID_NUIT_MESSAGE = "Insira um NUIT válido com 9 dígitos.";
export const INVALID_BI_MESSAGE = `Insira um BI válido: 12 dígitos e 1 letra (ex.: ${BI_EXAMPLE}).`;

export function normalizeNuit(value: unknown): string {
  return String(value ?? "").replace(/\D/g, "").slice(0, 9);
}

export function isValidNuit(value: unknown): boolean {
  return NUIT_REGEX.test(normalizeNuit(value));
}

/** Tira espaços, hífens e pontos e põe em maiúsculas: "1101 0012 3456-a" → "110100123456A". */
export function normalizeBi(value: unknown): string {
  return String(value ?? "")
    .toUpperCase()
    .replace(/[\s.\-]/g, "")
    .slice(0, 13);
}

export function isValidBi(value: unknown): boolean {
  return BI_REGEX.test(normalizeBi(value));
}

/** Telefone moçambicano: 9 dígitos começados por 82–87 (aceita +258 e espaços). */
export function normalizePhone(value: unknown): string {
  return String(value ?? "")
    .replace(/\D/g, "")
    .replace(/^258/, "");
}

export function isValidPhone(value: unknown): boolean {
  return /^8[2-7]\d{7}$/.test(normalizePhone(value));
}

export function formatPhone(value: string): string {
  const d = normalizePhone(value);
  return d.length === 9 ? `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}` : value;
}

export function isValidEmail(value: unknown): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? "").trim());
}
