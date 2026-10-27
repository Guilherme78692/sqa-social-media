package com.demoapp.demo.service;

import com.demoapp.demo.model.User;
import com.demoapp.demo.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Testes com Mockito: testam o UserService isoladamente, sem subir o Spring
 * e sem camada HTTP, mockando sua dependência (UserRepository).
 */
@ExtendWith(MockitoExtension.class)    //banco 
class UserServiceMockitoTest {

  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private UserService userService;

  @Test
  @DisplayName("createUser deve chamar o repositório para salvar e retornar o usuário criado")
  void createUser_deveSalvarERetornarUsuarioCriado() {
    User usuarioSalvo = new User();
    usuarioSalvo.setId(10L);
    usuarioSalvo.setEmail("novo@teste.com");
    usuarioSalvo.setPassword("Senha1@forte");

    when(userRepository.save(any(User.class))).thenReturn(usuarioSalvo);

    User resultado = userService.createUser("novo@teste.com", "Senha1@forte");

    assertEquals(10L, resultado.getId());
    assertEquals("novo@teste.com", resultado.getEmail());
    verify(userRepository, times(1)).save(any(User.class));
  }

  @Test
  @DisplayName("findByEmail deve retornar null quando o repositório não encontra o usuário")
  void findByEmail_deveRetornarNull_quandoNaoEncontrado() {
    when(userRepository.findByEmail("naoexiste@teste.com"))
        .thenReturn(Optional.empty());

    User resultado = userService.findByEmail("naoexiste@teste.com");

    assertNull(resultado);
    verify(userRepository, times(1)).findByEmail("naoexiste@teste.com");
  }
}
