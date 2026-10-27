import { isPasswordValid } from "./password";

describe("isPasswordValid (função pura, sem renderização de componentes)", () => {
  test("BUG: deve aceitar uma senha com EXATAMENTE 8 caracteres que cumpre todos os critérios (requisito: mínimo 8 caracteres)", () => {
    // Requisito do sistema: "mínimo 8 caracteres, 1 letra maiúscula, 1 letra minúscula,
    // 1 número e 1 caractere especial". "Mínimo 8" inclui o valor 8.
    // O código atual usa `password.length <= 8` (rejeita), quando deveria usar `< 8`.
    const senhaComOitoCaracteres = "Teste1@a"; // 8 caracteres, cumpre todos os critérios

    expect(isPasswordValid(senhaComOitoCaracteres)).toBe(true);
  });

  test("deve rejeitar senha sem caractere especial", () => {
    expect(isPasswordValid("Teste1234567")).toBe(false);
  });
});
