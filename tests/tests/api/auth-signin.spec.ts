import { test, expect, request as pwRequest } from "@playwright/test";
import { API_URL, gerarEmailUnico, SENHA_VALIDA } from "../helpers";

test.describe("API - POST /auth/signin", () => {
  test("deve autenticar com sucesso usando e-mail e senha corretos", async () => {
    const api = await pwRequest.newContext({ baseURL: API_URL });
    const email = gerarEmailUnico();

    // Pré-condição: usuário precisa existir antes de tentar logar
    await api.post("/auth/signup", {
      data: { email, password: SENHA_VALIDA },
    });

    const resposta = await api.post("/auth/signin", {
      data: { email, password: SENHA_VALIDA },
    });

    expect(resposta.status()).toBe(200);

    const corpo = await resposta.json();
    expect(corpo.email).toBe(email);
  });

  test("deve retornar status 401 e 'Credenciais inválidas' com senha incorreta", async () => {
    const api = await pwRequest.newContext({ baseURL: API_URL });
    const email = gerarEmailUnico();

    await api.post("/auth/signup", {
      data: { email, password: SENHA_VALIDA },
    });

    const resposta = await api.post("/auth/signin", {
      data: { email, password: "SenhaErrada123@" },
    });

    expect(resposta.status()).toBe(401);

    const corpo = await resposta.json();
    expect(corpo.message).toBe("Credenciais inválidas");
  });
});
