package com.demoapp.demo.controller;

import com.demoapp.demo.dto.UserDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Testes com MockMvc: sobem o contexto do Spring e exercitam os endpoints HTTP
 * reais de /auth, validando status code e corpo da resposta (contrato da API).
 *
 * Usam o banco H2 em memória configurado em src/test/resources/application.properties.
 * @Transactional em cada teste garante que os dados criados sejam desfeitos ao final,
 * evitando que um teste interfira no outro.
 */
@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerMockMvcTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  @Transactional
  @DisplayName("BUG: signup com e-mail já cadastrado deve retornar a mensagem 'E-mail já cadastrado' (requisito), mas o sistema retorna outra mensagem")
  void signupComEmailDuplicado_deveRetornarMensagemDoRequisito() throws Exception {
    UserDTO userDTO = new UserDTO();
    userDTO.setEmail("duplicado@teste.com");
    userDTO.setPassword("Senha1@forte");

    // Primeiro cadastro: deve funcionar normalmente
    mockMvc.perform(post("/auth/signup")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(userDTO)))
        .andExpect(status().isOk());

    // Segundo cadastro com o MESMO e-mail: deve ser rejeitado com a mensagem exata do requisito.
    // O requisito diz: 'O sistema deve exibir a mensagem de erro "E-mail já cadastrado"'.
    // O código atual retorna "E-mail já está em uso" -> este teste FALHA, capturando o bug.
    mockMvc.perform(post("/auth/signup")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(userDTO)))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.message").value("E-mail já cadastrado"));
  }

  @Test
  @Transactional
  @DisplayName("signin com senha incorreta deve retornar 401 e a mensagem 'Credenciais inválidas'")
  void signinComSenhaIncorreta_deveRetornarCredenciaisInvalidas() throws Exception {
    UserDTO cadastro = new UserDTO();
    cadastro.setEmail("usuario2@teste.com");
    cadastro.setPassword("Senha1@forte");

    mockMvc.perform(post("/auth/signup")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(cadastro)))
        .andExpect(status().isOk());

    UserDTO loginComSenhaErrada = new UserDTO();
    loginComSenhaErrada.setEmail("usuario2@teste.com");
    loginComSenhaErrada.setPassword("SenhaErrada1@");

    mockMvc.perform(post("/auth/signin")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(loginComSenhaErrada)))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.message").value("Credenciais inválidas"));
  }
}
