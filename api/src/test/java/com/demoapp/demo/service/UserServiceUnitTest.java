package com.demoapp.demo.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Testes unitários "simples": apenas JUnit, sem subir o contexto do Spring,
 * sem MockMvc e sem Mockito. Testam regras de negócio isoladas do UserService.
 *
 * Passamos "null" como UserRepository no construtor porque os métodos testados
 * aqui (isEmailValid e isPasswordValid) não acessam o repositório - são regras
 * de validação puras.
 */
class UserServiceUnitTest {

  private final UserService userService = new UserService(null);

  @Test
  @DisplayName("isEmailValid deve retornar true para e-mail com '@' e false para e-mail inválido ou nulo")
  void deveValidarEmailCorretamente() {
    assertTrue(userService.isEmailValid("usuario@teste.com"));
    assertFalse(userService.isEmailValid("emailsemarroba.com"));
    assertFalse(userService.isEmailValid(null));
  }

  @Test
  @DisplayName("isPasswordValid deve aceitar senha com EXATAMENTE 8 caracteres que cumpre os demais critérios (requisito: mínimo 8 caracteres)")
  void deveAceitarSenhaComExatamente8Caracteres() {
    // Requisito do sistema: "mínimo 8 caracteres, 1 letra maiúscula, 1 letra minúscula,
    // 1 número e 1 caractere especial". "Mínimo 8" inclui o valor 8.
    String senhaComOitoCaracteres = "Teste1@a"; // 8 caracteres: T-e-s-t-e-1-@-a
    assertTrue(
        userService.isPasswordValid(senhaComOitoCaracteres),
        "Uma senha de 8 caracteres que cumpre todos os critérios deveria ser válida"
    );

    String senhaCurtaDemais = "Ab1@a"; // 5 caracteres, não atinge o mínimo
    assertFalse(userService.isPasswordValid(senhaCurtaDemais));

    String senhaSemCaractereEspecial = "Teste1234"; // sem caractere especial
    assertFalse(userService.isPasswordValid(senhaSemCaractereEspecial));
  }
}
