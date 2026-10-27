# SQA Social Media — Testes E2E e de API (Playwright)

Testes de caixa-preta do projeto [SQA Social Media](https://github.com/PepeTonin/sqa-social-media):
End-to-End (simulando um usuário real no navegador) e de API (batendo direto
nos endpoints HTTP, sem olhar o código-fonte).

## Visão geral

- `tests/e2e/` — fluxos completos de usuário, testando a interface
- `tests/api/` — testes diretos contra os endpoints da API
- `tests/helpers.ts` — funções auxiliares compartilhadas (geração de dados únicos)
- `playwright.config.ts` — configuração dos navegadores e execução

Os testes esperam:

- Frontend rodando em `http://localhost:3000`
- API rodando em `http://localhost:8080`

## Pré-requisitos

- Node.js 18+
- API (`/api`) e frontend (`/client`) do projeto principal rodando

## Como rodar

Instale as dependências e os navegadores do Playwright:

```bash
npm install
npx playwright install
```

Execute todos os testes:

```bash
npm test
```

Execute só os testes E2E:

```bash
npm run test:e2e
```

Execute só os testes de API:

```bash
npm run test:api
```

Modo visual (navegador aparece na tela, útil pra apresentação/gravação):

```bash
npm run test:headed
```

Modo interativo (interface do Playwright):

```bash
npm run test:ui
```

Ver o relatório HTML após a execução:

```bash
npm run report
```

## Testes implementados

### E2E (`tests/e2e/`)

| Arquivo | Testes |
|---|---|
| `cadastro.spec.ts` | Cadastro com sucesso (redireciona e autentica) / Cadastro com e-mail duplicado (mostra erro) |
| `login.spec.ts` | Login com sucesso (redireciona e autentica) / Login com senha incorreta (mostra "Credenciais inválidas") |
| `curtidas.spec.ts` | Curtir deslogado (alert nativo) / Curtir logado (feedback visual) |

### API (`tests/api/`)

| Arquivo | Testes |
|---|---|
| `auth-signup.spec.ts` | Cadastro válido (200) / E-mail duplicado (409) / E-mail inválido (422) |
| `auth-signin.spec.ts` | Login válido (200) / Credenciais inválidas (401) |
| `auth-reset-password.spec.ts` | E-mail não cadastrado (404) / E-mail cadastrado (200) |
| `posts-listagem.spec.ts` | Lista de posts (200, formato correto) / Paginação com `limit` |
| `posts-curtir.spec.ts` | Curtir e descurtir (toggle) / Requisição sem `userId` (400) |

## Referência

- [Documentação do Playwright](https://playwright.dev/docs/intro)
