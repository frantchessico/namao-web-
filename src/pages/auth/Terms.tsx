import { useNavigate } from "react-router-dom";
import { Title, useDocumentTitle } from "../../components/Layout";
import { useStore } from "../../store/AppStore";
import { track } from "../../analytics";

// Texto de sgm-app/src/pages/TermsConditions.
const ARTICLES: { title: string; body: string }[] = [
  {
    title: "Artigo 1º (Das condições de uso)",
    body: "1. Para ser usuário da plataforma de disponibilização de dados, conhecido por namao, o usuário deve cumulativamente preencher os seguintes requisitos: a) Ser um operador de microcrédito devidamente autorizado e registrado no Banco de Moçambique; b) Proceder a uma declaração, sob compromisso de honra, de que usará a plataforma namao, só e apenas, para efeitos de prevenção de créditos mal parados. 2. Só poderão ser disponibilizados dados de mutuários que tenham expressamente declarado autorizar o usuário da plataforma para esse efeito, nos contratos de concessão de crédito.",
  },
  {
    title: "Artigo 2º (Deveres do usuário)",
    body: "1. O usuário é responsável perante o seu mutuário e lei em caso de disponibilização da sua informação sem prévia aquiescência deste, ou para fins alheios à prevenção de créditos mal parados, sem prejuízo de medidas adequadas ao caso que poderão ser tomadas pela gestão da namao. 2. Para efeitos do disposto no número anterior, a gestão da namao poderá irradiar o prevaricador do uso da Plataforma. 3. A utilização fraudulenta da plataforma é passível de responsabilidade civil ou criminal, nos termos da lei.",
  },
  { title: "Artigo 3º (Gestão da PDD)", body: "A plataforma é gerida pela entidade que a criou." },
  {
    title: "Artigo 4º (Adesão à Plataforma)",
    body: "Para efeitos de adesão à plataforma, o usuário deverá fornecer o nome da Microcrédito e a licença do Banco de Moçambique. Aceitar os termos e condições de uso da plataforma mediante o click na plataforma durante o seu cadastro.",
  },
  {
    title: "Artigo 5º (Disposições finais e transitórias)",
    body: "1. Os casos omissos nestes termos de utilização da Plataforma serão regulados de acordo com a pertinente legislação em vigor na República de Moçambique. 2. Os diferendos, entre os usuários, decorrentes da aplicação da plataforma serão resolvidos de forma amigável, bastando para o efeito a indicação de uma individualidade idónea por cada uma das partes em litígio e estas, por sua vez, escolherão uma terceira individualidade, igualmente idónea, para resolução do diferendo. 3. Estes termos de utilização da plataforma poderão ser alterados a qualquer momento, devendo ser comunicadas as alterações aos usuários da plataforma.",
  },
  {
    title: "Artigo 6º (Privacidade dos dados)",
    body: "1. A plataforma namao garante a privacidade dos dados dos mutuários, de acordo com a legislação em vigor na República de Moçambique. 2. Os dados dos mutuários só serão compartilhados com usuários autorizados e devidamente registrados na plataforma, e somente para fins de prevenção de créditos malparados. 3. Qualquer uso não autorizado dos dados dos mutuários será considerado uma violação da privacidade e poderá resultar em medidas adequadas ao caso.",
  },
  {
    title: "Artigo 7º (Atualização dos dados)",
    body: "1. Os usuários são responsáveis por manter os dados dos mutuários atualizados na plataforma namao. 2. Qualquer alteração nos dados dos mutuários deve ser imediatamente registrada na plataforma, a fim de garantir a precisão das informações compartilhadas entre os usuários.",
  },
  {
    title: "Artigo 8º (Responsabilidade dos usuários)",
    body: "1. Os usuários da plataforma namao são os únicos responsáveis por garantir o uso adequado e legítimo dos dados dos mutuários. 2. Qualquer uso inadequado ou ilegítimo dos dados dos mutuários pode resultar em responsabilidade civil ou criminal, nos termos da lei.",
  },
  {
    title: "Artigo 9º (Termo de uso atualizado)",
    body: "1. Estes termos de referência podem ser atualizados a qualquer momento, de acordo com as necessidades da plataforma namao. 2. Os usuários serão notificados de quaisquer atualizações nos termos de referência por meio de uma comunicação por escrito.",
  },
  {
    title: "Artigo 10º (Rescisão de uso)",
    body: "1. Os usuários têm o direito de rescindir o uso da plataforma namao a qualquer momento, mediante notificação por escrito à gestão da plataforma. 2. A gestão da plataforma reserva-se o direito de rescindir o uso da plataforma por usuários que violem os termos de referência de uso da plataforma.",
  },
];

export function TermsText() {
  return (
    <article className="terms" tabIndex={0} aria-label="Texto dos termos e condições">
      {ARTICLES.map((a) => (
        <section key={a.title}>
          <h2>{a.title}</h2>
          <p>{a.body}</p>
        </section>
      ))}
    </article>
  );
}

/**
 * Primeiro acesso: o funcionário tem de aceitar antes de entrar.
 * Já aceite (vindo da Conta ou do login): só leitura, com "Voltar".
 */
export function Terms() {
  useDocumentTitle("Termos e condições");
  const { isLoggedIn, auth, acceptTerms } = useStore();
  const navigate = useNavigate();
  const mustAccept = isLoggedIn && !auth.termsAccepted;

  return (
    <div className="app">
      <img src="/assets/bg-dots.png" alt="" aria-hidden="true" className="bg-dots" style={{ top: 0 }} />
      <header className="header">
        <div className="header__inner">
          <span className="header__logo">
            <img src="/assets/logo.png" alt="namao" />
          </span>
        </div>
      </header>
      <main className="main" style={{ maxWidth: 820, paddingTop: 48 }}>
        <Title>Termos e Condições</Title>
        <p className="subtitle" style={{ marginBottom: 28 }}>
          Leia os termos de uso da plataforma namao antes de continuar.
        </p>
        <TermsText />
        <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          {mustAccept ? (
            <>
              <p style={{ margin: 0, fontSize: 13, lineHeight: "20px", color: "var(--text-2)" }}>
                Ao aceitar, confirma que leu e concorda com os termos acima.
              </p>
              <button
                type="button"
                className="btn btn--primary"
                style={{ flex: "0 1 320px", fontWeight: 500 }}
                onClick={() => {
                  acceptTerms();
                  track("terms_accepted");
                  navigate("/mutuarios", { replace: true });
                }}
              >
                Aceitar
              </button>
            </>
          ) : (
            <button type="button" className="btn btn--light btn--md" onClick={() => navigate(-1)}>
              Voltar
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
