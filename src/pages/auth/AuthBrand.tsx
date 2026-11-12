/** Painel azul do login, com o slogan do ecrã de entrada do app. */
export function AuthBrand() {
  return (
    <section className="auth__brand">
      <img src="/assets/bg-message.png" alt="" aria-hidden="true" className="decor" />
      <img src="/assets/logo-white.png" alt="namao" className="logo" />
      <p className="auth__slogan">Confirma namao tudo o que você precisa</p>
    </section>
  );
}
