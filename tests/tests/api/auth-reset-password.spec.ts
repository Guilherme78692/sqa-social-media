import { test, expect, request as pwRequest } from "@playwright/test";
import { API_URL, gerarEmailUnico, SENHA_VALIDA } from "../helpers";

test.describe("API - POST /auth/reset-password", () => {
  test("deve retornar status 404 e 'Usuário não encontrado' para e-mail não cadastrado", async () => {
    const api = await pwRequest.newContext({ baseURL: API_URL });
    const emailInexistente = gerarEmailUnico();

    const resposta = await api.post("/auth/reset-password", {
      data: { email: emailInexistente },
    });

    expect(resposta.status()).toBe(404);

    const corpo = await resposta.json();
    expect(corpo.message).toBe("Usuário não encontrado");
  });

  test("deve retornar status 200 ao solicitar reset para um e-mail cadastrado", async () => {
    const api = await pwRequest.newContext({ baseURL: API_URL });
    const email = gerarEmailUnico();

    await api.post("/auth/signup", {
      data: { email, password: SENHA_VALIDA },
    });

    const resposta = await api.post("/auth/reset-password", {
      data: { email },
    });

    expect(resposta.status()).toBe(200);
  });
});
