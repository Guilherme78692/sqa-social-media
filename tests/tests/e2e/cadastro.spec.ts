import { test, expect } from "@playwright/test";
import { FRONTEND_URL, gerarEmailUnico, SENHA_VALIDA } from "../helpers";

test.describe("E2E - Fluxo de cadastro", () => {
  test("deve cadastrar um novo usuário com dados válidos e redirecionar para a home autenticado", async ({
    page,
  }) => {
    await page.goto(FRONTEND_URL);

    // Clica no botão "Criar Conta" do cabeçalho (usuário deslogado)
    await page.getByRole("button", { name: "Criar Conta" }).click();
    await expect(page).toHaveURL(/\/signup$/);

    const email = gerarEmailUnico();

    // Preenche o formulário de cadastro
    await page.getByPlaceholder("seu@email.com").fill(email);
    const camposDeSenha = page.getByPlaceholder("••••••••");
    await camposDeSenha.nth(0).fill(SENHA_VALIDA); // Senha
    await camposDeSenha.nth(1).fill(SENHA_VALIDA); // Confirmar Senha

    // O texto "Criar Conta" também existe no cabeçalho, então restringimos
    // a busca ao botão de dentro do <form>, para não ser ambíguo.
    await page
      .locator("form")
      .getByRole("button", { name: "Criar Conta" })
      .click();

    // Após o cadastro bem-sucedido, o requisito pede redirecionamento para "/"
    await page.waitForURL(FRONTEND_URL);
    await expect(page).toHaveURL(FRONTEND_URL);

    // E o usuário deve estar autenticado (cabeçalho muda para "Sair")
    await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Posts Curtidos" })
    ).toBeVisible();
  });

  test("deve impedir o cadastro com um e-mail já utilizado e mostrar mensagem de erro", async ({
    page,
    request,
  }) => {
    const email = gerarEmailUnico();

    // Garante que esse e-mail já existe, cadastrando-o direto pela API
    // antes de tentar cadastrar de novo pela tela.
    await request.post("http://localhost:8080/auth/signup", {
      data: { email, password: SENHA_VALIDA },
    });

    await page.goto(`${FRONTEND_URL}/signup`);

    await page.getByPlaceholder("seu@email.com").fill(email);
    const camposDeSenha = page.getByPlaceholder("••••••••");
    await camposDeSenha.nth(0).fill(SENHA_VALIDA);
    await camposDeSenha.nth(1).fill(SENHA_VALIDA);

    await page
      .locator("form")
      .getByRole("button", { name: "Criar Conta" })
      .click();

    // Continua na tela de cadastro (não deve redirecionar) e mostra o erro
    // retornado pela API (o mesmo texto que o backend envia).
    await expect(page).toHaveURL(/\/signup$/);
    await expect(page.getByText("E-mail já está em uso")).toBeVisible();
  });
});
