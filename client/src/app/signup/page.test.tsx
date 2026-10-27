import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AxiosError } from "axios";
import { AuthProvider } from "@/contexts/AuthContext";
import SignUp from "./page";
import { authService } from "@/service/auth/auth";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("../../service/auth/auth", () => ({
  authService: {
    signUp: jest.fn(),
  },
}));

// Constrói um erro do tipo AxiosError de verdade, simulando a resposta 409
// que a API retornaria para um e-mail já cadastrado.
function criarErroDeEmailDuplicado() {
  return new AxiosError(
    "Request failed with status code 409",
    "ERR_BAD_REQUEST",
    undefined,
    undefined,
    {
      data: { message: "E-mail já está em uso" },
      status: 409,
      statusText: "Conflict",
      headers: {},
      config: {} as never,
    } as never
  );
}

describe("Fluxo de cadastro (SignUp) - teste de integração", () => {
  test("deve preencher o formulário, enviar e exibir a mensagem de erro retornada pela API quando o e-mail já está cadastrado", async () => {
    (authService.signUp as jest.Mock).mockRejectedValue(
      criarErroDeEmailDuplicado()
    );

    render(
      <AuthProvider>
        <SignUp />
      </AuthProvider>
    );

    // Preenche o formulário (Email, Senha e Confirmar Senha)
    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "duplicado@teste.com" },
    });

    const camposDeSenha = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(camposDeSenha[0], {
      target: { value: "Senha1@forte" },
    }); // campo Senha
    fireEvent.change(camposDeSenha[1], {
      target: { value: "Senha1@forte" },
    }); // campo Confirmar Senha

    // O texto "Criar Conta" aparece duas vezes na tela: no botão do Header
    // e no botão de submit do formulário. Pegamos o último (o do formulário).
    const botoesCriarConta = screen.getAllByText("Criar Conta");
    fireEvent.click(botoesCriarConta[botoesCriarConta.length - 1]);

    await waitFor(() => {
      expect(authService.signUp).toHaveBeenCalledWith({
        email: "duplicado@teste.com",
        password: "Senha1@forte",
      });
    });

    expect(
      await screen.findByText("E-mail já está em uso")
    ).toBeInTheDocument();
  });
});
