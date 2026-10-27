import { test, expect, request as pwRequest } from "@playwright/test";
import { API_URL } from "../helpers";

test.describe("API - GET /posts", () => {
  test("deve retornar uma lista de posts com status 200", async () => {
    const api = await pwRequest.newContext({ baseURL: API_URL });

    const resposta = await api.get("/posts", {
      params: { limit: "5", skip: "0" },
    });

    expect(resposta.status()).toBe(200);

    const corpo = await resposta.json();
    expect(Array.isArray(corpo.posts)).toBeTruthy();
    expect(corpo.posts.length).toBeGreaterThan(0);

    // Confere o formato (contrato) de cada post retornado
    const primeiroPost = corpo.posts[0];
    expect(typeof primeiroPost.id).toBe("number");
    expect(typeof primeiroPost.title).toBe("string");
    expect(typeof primeiroPost.body).toBe("string");
    expect(typeof primeiroPost.liked).toBe("boolean");
  });

  test("deve respeitar o parâmetro 'limit' na quantidade de posts retornados", async () => {
    const api = await pwRequest.newContext({ baseURL: API_URL });

    const resposta = await api.get("/posts", {
      params: { limit: "3", skip: "0" },
    });

    expect(resposta.status()).toBe(200);

    const corpo = await resposta.json();
    expect(corpo.posts.length).toBe(3);
    expect(corpo.limit).toBe(3);
  });
});
