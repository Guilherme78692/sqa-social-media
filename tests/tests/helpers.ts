/**
 * Funções auxiliares usadas pelos testes de E2E e de API.
 * Geram dados únicos a cada execução, para evitar que um teste
 * "esbarre" em dados deixados por uma execução anterior (ex: e-mail
 * já cadastrado no banco de um teste rodado ontem).
 */

export const FRONTEND_URL = "http://localhost:3000";
export const API_URL = "http://localhost:8080";

/** Gera um e-mail único, combinando timestamp + número aleatório. */
export function gerarEmailUnico(): string {
  const timestamp = Date.now();
  const aleatorio = Math.floor(Math.random() * 100000);
  return `usuario${timestamp}${aleatorio}@teste.com`;
}

/**
 * Senha fixa que cumpre todos os critérios do requisito (mínimo 8
 * caracteres, maiúscula, minúscula, número e caractere especial).
 * Usa 9 caracteres de propósito, para não esbarrar no bug conhecido
 * do frontend que rejeita senhas de exatamente 8 caracteres.
 */
export const SENHA_VALIDA = "Teste123@";
