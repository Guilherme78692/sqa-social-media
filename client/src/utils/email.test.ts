import { isEmailValid } from "./email";

describe("isEmailValid (função pura, sem renderização de componentes)", () => {
  test("deve retornar true para e-mails válidos e false para e-mails inválidos", () => {
    expect(isEmailValid("usuario@teste.com")).toBe(true);
    expect(isEmailValid("emailinvalido")).toBe(false);
    expect(isEmailValid("")).toBe(false);
    expect(isEmailValid("outro.usuario@dominio.com.br")).toBe(true);
  });
});
