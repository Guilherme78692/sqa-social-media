import { test, expect } from "@playwright/test";
import { API_URL, FRONTEND_URL, gerarEmailUnico, SENHA_VALIDA } from "../helpers";

test.describe("E2E - Curtir posts", () => {
  test("usuário deslogado deve ver um alerta nativo ao tentar curtir um post", async ({
    page,
  }) => {
    await page.goto(FRONTEND_URL);

    // Confirma que a tela realmente carregou deslogada
    await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();

    const botaoCurtir = page.getByRole("button", { name: "Curtir" }).first();
    await expect(botaoCurtir).toBeVisible();

    // Captura o texto do alert nativo do navegador disparado pelo clique
    const dialogPromise = new Promise<string>((resolve) => {
      page.once("dialog", async (dialog) => {
        resolve(dialog.message());
        await dialog.accept();
      });
    });

    await botaoCurtir.click();
    const mensagem = await dialogPromise;

    expect(mensagem).toBe(
      "Você precisa estar autenticado para curtir posts!"
    );
  });

  test("usuário logado deve conseguir curtir um post e ver o feedback visual", async ({
    page,
    request,
  }) => {
    // Cria e autentica um usuário direto pela API para já começar logado
    const email = gerarEmailUnico();
    await request.post(`${API_URL}/auth/signup`, {
      data: { email, password: SENHA_VALIDA },
    });

    await page.goto(`${FRONTEND_URL}/signin`);
    await page.getByPlaceholder("seu@email.com").fill(email);
    await page.getByPlaceholder("••••••••").fill(SENHA_VALIDA);
    await page.locator("form").getByRole("button", { name: "Entrar" }).click();
    await page.waitForURL(FRONTEND_URL);

    const primeiroCard = page
      .getByRole("button", { name: "Curtir" })
      .first();
    await expect(primeiroCard).toBeVisible();

    // Nenhum dialog deveria aparecer agora que o usuário está autenticado
    page.on("dialog", (dialog) => {
      throw new Error(
        `Não deveria aparecer alert para usuário autenticado: ${dialog.message()}`
      );
    });

    await primeiroCard.click();

    // O requisito pede um feedback visual ao curtir (ex: coração vermelho
    // preenchido). O componente troca o texto do botão para "Curtido".
    await expect(
      page.getByRole("button", { name: "Curtido" }).first()
    ).toBeVisible();
  });
});
