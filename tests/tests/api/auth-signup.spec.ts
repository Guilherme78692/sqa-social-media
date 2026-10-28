import { test, expect, request as pwRequest } from "@playwright/test";
import { API_URL, gerarEmailUnico, SENHA_VALIDA } from "../helpers";

test.describe("API - POST /auth/signup", () => {
  test("deve criar um usuário com e-mail e senha válidos e retornar status 200", async () => {
    const api = await pwRequest.newContext({ baseURL: API_URL });
    const email = gerarEmailUnico();

    const resposta = await api.post("/auth/signup", {
      data: { email, password: SENHA_VALIDA },
    });

    expect(resposta.status()).toBe(200);

    const corpo = await resposta.json();
    expect(typeof corpo.id).toBe("number");
    expect(corpo.email).toBe(email);
  });

  test("deve retornar status 409 ao tentar cadastrar um e-mail já existente", async () => {
    const api = await pwRequest.newContext({ baseURL: API_URL });
    const email = gerarEmailUnico();

    // Primeiro cadastro: deve funcionar normalmente
    const primeiraResposta = await api.post("/auth/signup", {
      data: { email, password: SENHA_VALIDA },
    });
    expect(primeiraResposta.status()).toBe(200);

    // Segundo cadastro com o MESMO e-mail: deve ser rejeitado
    const segundaResposta = await api.post("/auth/signup", {
      data: { email, password: SENHA_VALIDA },
    });

    expect(segundaResposta.status()).toBe(409);

    const corpo = await segundaResposta.json();
    expect(corpo.message).toBe("E-mail já cadastrado");
  });

  test("deve retornar status 422 ao tentar cadastrar com e-mail inválido", async () => {
    const api = await pwRequest.newContext({ baseURL: API_URL });

    const resposta = await api.post("/auth/signup", {
      data: { email: "email-sem-arroba", password: SENHA_VALIDA },
    });

    expect(resposta.status()).toBe(422);

    const corpo = await resposta.json();
    expect(corpo.message).toBe("E-mail já cadastrado");
  });
});
