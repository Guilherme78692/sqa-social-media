import { test, expect } from "@playwright/test";
import { API_URL, FRONTEND_URL, gerarEmailUnico, SENHA_VALIDA } from "../helpers";

test.describe("E2E - Fluxo de login", () => {
  test("deve logar com sucesso usando um e-mail e senha válidos e ser redirecionado para a home", async ({
    page,
    request,
  }) => {
    // Cria o usuário direto pela API (mais rápido e confiável do que
    // passar pela tela de cadastro só para preparar o cenário do teste).
    const email = gerarEmailUnico();
    const resposta = await request.post(`${API_URL}/auth/signup`, {
      data: { email, password: SENHA_VALIDA },
    });
    expect(resposta.ok()).toBeTruthy();

    await page.goto(`${FRONTEND_URL}/signin`);

    await page.getByPlaceholder("seu@email.com").fill(email);
    await page.getByPlaceholder("••••••••").fill(SENHA_VALIDA);

    // "Entrar" também aparece no cabeçalho quando deslogado, então
    // restringimos a busca ao botão de dentro do formulário.
    await page.locator("form").getByRole("button", { name: "Entrar" }).click();

    await page.waitForURL(FRONTEND_URL);
    await expect(page).toHaveURL(FRONTEND_URL);
    await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();
  });

  test("deve exibir 'Credenciais inválidas' ao tentar logar com senha incorreta", async ({
    page,
    request,
  }) => {
    const email = gerarEmailUnico();
    await request.post(`${API_URL}/auth/signup`, {
      data: { email, password: SENHA_VALIDA },
    });

    await page.goto(`${FRONTEND_URL}/signin`);

    await page.getByPlaceholder("seu@email.com").fill(email);
    await page.getByPlaceholder("••••••••").fill("SenhaErrada123@");
    await page.locator("form").getByRole("button", { name: "Entrar" }).click();

    // Continua deslogado e mostra a mensagem de erro do requisito
    await expect(page).toHaveURL(/\/signin$/);
    await expect(page.getByText("Credenciais inválidas")).toBeVisible();
  });
});
