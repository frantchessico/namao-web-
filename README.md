# namao Web — protótipo

Versão web do app `sgm-app`, de ponta a ponta, **sem API**. Os dados são simulados em memória e guardados no `localStorage` do browser.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + build de produção
```

## Como entrar

1. Qualquer email válido.
2. Qualquer código de 6 dígitos (`000000` mostra o erro "Código inválido").
3. Aceitar os termos no primeiro acesso.

O botão **Repor dados** (canto inferior esquerdo) volta aos dados de exemplo.

## Dados de exemplo para testar a pesquisa

| Caso | NUIT | BI |
|---|---|---|
| Mutuário seu | 400123456 | 110100123456A |
| De outra instituição, por importar | 405678901 | 110500567890E |
| Não existe (abre o cadastro) | qualquer outro | qualquer outro |

## Rotas

| Rota | Ecrã |
|---|---|
| `/entrar`, `/entrar/codigo` | Login por email e código |
| `/termos` | Termos e condições |
| `/mutuarios` (`?aba=importados`) | Lista de criados / importados |
| `/pesquisar` | Pesquisa por NUIT ou BI |
| `/mutuarios/novo` | Cadastro (só a partir de uma pesquisa sem resultado) |
| `/mutuarios/:id` | Detalhes e histórico de status |
| `/mutuarios/:id/status` | Modal de actualizar status |
| `/sucesso` | Ecrã azul de confirmação |
| `/conta`, `/conta/eliminar` | Conta e eliminar conta |
| `/notificacoes` | Notificações |

## Ligar à API mais tarde

Toda a "API" está em `src/store/AppStore.tsx`. Cada acção tem um comentário com o endpoint do back-end que vai substituir (`POST /borrowers/search`, `POST /borrowers`, `POST /borrowers/requests/:borrower`, …). As páginas só falam com o store, por isso a integração fica concentrada nesse ficheiro.

## Deploy na Vercel

O projecto já tem `vercel.json` (Vite, `npm ci`, `npm run build`, saída em `dist/`) e uma regra que manda todas as rotas para `index.html`, para que links directos como `/mutuarios/b_ana` ou um refresh não deem 404. Não precisa de variáveis de ambiente.

**Pelo painel (recomendado):** pôr o projecto num repositório Git → vercel.com → *Add New… → Project* → importar o repositório. Se o repositório for a pasta `namao` inteira, definir **Root Directory = `namao-web`**. O resto é lido do `vercel.json`.

**Pela linha de comandos:**

```bash
cd namao-web
npx vercel login
npx vercel          # preview
npx vercel --prod   # produção
```

Os dados vivem no `localStorage` de cada browser: cada pessoa que abrir o link vê os seus próprios dados de exemplo.
# namao-web-
