// Dados de exemplo do protótipo. Todos os nomes, NUITs e BIs são fictícios.
import type { Borrower, User } from "../types";

export const MY_INSTITUTION = "Microcrédito Exemplo";

export const MOCK_USER: Omit<User, "email"> = {
  name: "Funcionário de Teste",
  role: "Funcionário",
  institution: MY_INSTITUTION,
};

const ME = "Funcionário de Teste";

export const SEED_BORROWERS: Borrower[] = [
  {
    id: "b_ana",
    firstName: "Ana",
    lastName: "Macuácua",
    gender: "Feminino",
    docType: "Bilhete de Identidade",
    docNumber: "110100123456A",
    nuit: "400123456",
    phone: "841234567",
    address: "Bairro Maxaquene A, Maputo",
    contractDate: "2026-06-12",
    owner: "me",
    institution: MY_INSTITUTION,
    registeredBy: ME,
    createdAt: "2026-06-12",
    statuses: [
      { id: "s1", type: "Crédito em andamento", note: "Crédito de 6 meses aprovado.", date: "2026-06-12", institution: MY_INSTITUTION },
      { id: "s2", type: "Crédito em andamento", note: "Terceira prestação paga.", date: "2026-10-12", institution: MY_INSTITUTION },
    ],
  },
  {
    id: "b_carlos",
    firstName: "Carlos",
    lastName: "Nhantumbo",
    gender: "Masculino",
    docType: "Passaporte",
    docNumber: "13AB45678",
    nuit: "401234567",
    phone: "821234567",
    address: "Bairro Polana Caniço, Maputo",
    contractDate: "2026-03-02",
    owner: "me",
    institution: MY_INSTITUTION,
    registeredBy: ME,
    createdAt: "2025-11-20",
    statuses: [
      { id: "s3", type: "Devedor", note: "Duas prestações em atraso.", date: "2025-12-02", institution: "Crédito Rápido Lda" },
      { id: "s4", type: "Sem crédito", note: "Regularizou a dívida.", date: "2026-01-15", institution: "Crédito Rápido Lda" },
      { id: "s5", type: "Devedor", note: "Uma prestação em atraso.", date: "2026-03-02", institution: MY_INSTITUTION },
      { id: "s6", type: "Crédito em andamento", note: "Crédito de 6 meses aprovado.", date: "2026-06-12", institution: MY_INSTITUTION },
      { id: "s7", type: "Sem crédito", note: "Pagou o último crédito.", date: "2026-10-08", institution: MY_INSTITUTION },
    ],
  },
  {
    id: "b_fatima",
    firstName: "Fátima",
    lastName: "Cossa",
    gender: "Feminino",
    docType: "Bilhete de Identidade",
    docNumber: "110200234567B",
    nuit: "402345678",
    phone: "861234567",
    address: "Bairro da Liberdade, Matola",
    owner: "me",
    institution: MY_INSTITUTION,
    registeredBy: ME,
    createdAt: "2026-05-04",
    statuses: [
      { id: "s8", type: "Crédito em andamento", note: "Crédito de 3 meses.", date: "2026-05-04", institution: MY_INSTITUTION },
      { id: "s9", type: "Devedor", note: "Duas prestações em atraso.", date: "2026-09-30", institution: MY_INSTITUTION },
    ],
  },
  {
    id: "b_helder",
    firstName: "Hélder",
    lastName: "Mabunda",
    gender: "Masculino",
    docType: "DIR",
    docNumber: "0123456",
    phone: "871234567",
    address: "Bairro Ferroviário, Maputo",
    owner: "me",
    institution: MY_INSTITUTION,
    registeredBy: ME,
    createdAt: "2026-09-21",
    statuses: [
      { id: "s15", type: "Sem crédito", note: "Registado sem crédito activo.", date: "2026-09-21", institution: MY_INSTITUTION },
    ],
  },
  {
    id: "b_joana",
    firstName: "Joana",
    lastName: "Sitoe",
    gender: "Feminino",
    docType: "Bilhete de Identidade",
    docNumber: "110300345678C",
    nuit: "403456789",
    phone: "851234567",
    address: "Bairro Zimpeto, Maputo",
    owner: "me",
    institution: MY_INSTITUTION,
    registeredBy: ME,
    createdAt: "2026-09-02",
    statuses: [
      { id: "s10", type: "Crédito em andamento", note: "Crédito de 12 meses aprovado.", date: "2026-09-02", institution: MY_INSTITUTION },
    ],
  },
  {
    id: "b_mateus",
    firstName: "Mateus",
    lastName: "Langa",
    gender: "Masculino",
    docType: "Bilhete de Identidade",
    docNumber: "110400456789D",
    nuit: "404567890",
    phone: "841112233",
    address: "Bairro Malhangalene, Maputo",
    owner: "other",
    institution: "Crédito Rápido Lda",
    registeredBy: "Funcionário da Crédito Rápido",
    createdAt: "2026-02-10",
    statuses: [
      { id: "s11", type: "Crédito em andamento", note: "Crédito de 6 meses.", date: "2026-02-10", institution: "Crédito Rápido Lda" },
      { id: "s12", type: "Sem crédito", note: "Pagou o último crédito.", date: "2026-08-10", institution: "Crédito Rápido Lda" },
    ],
  },
  {
    id: "b_lucia",
    firstName: "Lúcia",
    lastName: "Bila",
    gender: "Feminino",
    docType: "Carta de Condução",
    docNumber: "MP0012345",
    nuit: "406789012",
    phone: "829998877",
    address: "Bairro Chamanculo, Maputo",
    owner: "other",
    institution: "Fundo Comunitário",
    registeredBy: "Funcionário do Fundo Comunitário",
    createdAt: "2026-04-22",
    statuses: [
      { id: "s13", type: "Devedor", note: "Três prestações em atraso.", date: "2026-07-01", institution: "Fundo Comunitário" },
    ],
  },
  {
    id: "b_rui",
    firstName: "Rui",
    lastName: "Tembe",
    gender: "Masculino",
    docType: "Bilhete de Identidade",
    docNumber: "110500567890E",
    nuit: "405678901",
    phone: "843334455",
    address: "Bairro Hulene, Maputo",
    owner: "other",
    institution: "Crédito Rápido Lda",
    registeredBy: "Funcionário da Crédito Rápido",
    createdAt: "2026-01-18",
    statuses: [
      { id: "s14", type: "Crédito em andamento", note: "Crédito de 12 meses.", date: "2026-01-18", institution: "Crédito Rápido Lda" },
    ],
  },
];

/** Mutuários de outras instituições que já constam na lista de importados. */
export const SEED_IMPORTED = ["b_mateus", "b_lucia"];

/** O protótipo aceita qualquer código de 6 dígitos excepto este, para mostrar o erro. */
export const INVALID_DEMO_CODE = "000000";
