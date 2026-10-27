import { test, expect, request as pwRequest } from "@playwright/test";
import { API_URL } from "../helpers";

test.describe("API - POST /posts/{postId}/like", () => {
  test("deve curtir um post (liked: true) e, ao chamar de novo, descurtir (liked: false)", async () => {
    const api = await pwRequest.newContext({ baseURL: API_URL });

    // userId aleatório e alto, só para não colidir com usuários reais
    const userId = Math.floor(100000 + Math.random() * 900000);
    const postId = 1;

    // Primeira chamada: deve curtir
    const primeiraResposta = await api.post(`/posts/${postId}/like`, {
      params: { userId: String(userId) },
    });

    expect(primeiraResposta.status()).toBe(200);
    const primeiroCorpo = await primeiraResposta.json();
    expect(primeiroCorpo.postId).toBe(postId);
    expect(primeiroCorpo.liked).toBe(true);

    // Segunda chamada com o mesmo usuário e post: deve descurtir (toggle)
    const segundaResposta = await api.post(`/posts/${postId}/like`, {
      params: { userId: String(userId) },
    });

    expect(segundaResposta.status()).toBe(200);
    const segundoCorpo = await segundaResposta.json();
    expect(segundoCorpo.postId).toBe(postId);
    expect(segundoCorpo.liked).toBe(false);
  });

  test("deve retornar status 400 ao tentar curtir sem informar o userId", async () => {
    const api = await pwRequest.newContext({ baseURL: API_URL });

    const resposta = await api.post("/posts/1/like");

    // O endpoint exige o parâmetro userId; sem ele, o Spring rejeita
    // a requisição antes mesmo de chegar na regra de negócio.
    expect(resposta.status()).toBe(400);
  });
});
