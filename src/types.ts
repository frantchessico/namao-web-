export type StatusType = "Sem crédito" | "Crédito em andamento" | "Devedor";

export const STATUS_TYPES: StatusType[] = ["Sem crédito", "Crédito em andamento", "Devedor"];

export type StatusEntry = {
  id: string;
  type: StatusType;
  note: string;
  /** Data do estado, ISO yyyy-mm-dd. */
  date: string;
  institution: string;
};

export type Gender = "Masculino" | "Feminino";

export const GENDERS: Gender[] = ["Masculino", "Feminino"];

export type DocType = "Bilhete de Identidade" | "DIR" | "Carta de Condução" | "Passaporte";

export const DOC_TYPES: DocType[] = ["Bilhete de Identidade", "DIR", "Carta de Condução", "Passaporte"];

export type Borrower = {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  docType: DocType;
  docNumber: string;
  nuit?: string;
  phone: string;
  address: string;
  email?: string;
  contractDate?: string;
  /** "me" quando foi registado pelo funcionário com sessão iniciada. */
  owner: "me" | "other";
  /** Instituição que registou o mutuário. */
  institution: string;
  registeredBy: string;
  createdAt: string;
  /** Do mais antigo ao mais recente. */
  statuses: StatusEntry[];
};

export type SearchType = "nuit" | "bi";

export type User = {
  name: string;
  email: string;
  role: string;
  institution: string;
};
