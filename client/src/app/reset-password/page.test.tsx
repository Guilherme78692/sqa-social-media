import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider } from "@/contexts/AuthContext";
import ResetPassword from "./page";
import { authService } from "@/service/auth/auth";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("../../service/auth/auth", () => ({
  authService: {
    resetPassword: jest.fn(),
  },
}));

describe("Fluxo de redefinição de senha (ResetPassword) - teste de integração", () => {
  test('BUG: deve exibir a mensagem de sucesso "E-mail enviado com sucesso" após envio para um e-mail válido (requisito)', async () => {
    (authService.resetPassword as jest.Mock).mockResolvedValue(undefined);

    render(
      <AuthProvider>
        <ResetPassword />
      </AuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "usuario@teste.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Enviar Email" }));

    await waitFor(() => {
      expect(authService.resetPassword).toHaveBeenCalledWith({
        email: "usuario@teste.com",
      });
    });

    // Requisito: 'um toast de sucesso deve ser exibido com a mensagem:
    // "E-mail enviado com sucesso"'.
    // O código atual exibe uma mensagem diferente ("Email enviado com sucesso
    // para alterar a senha! Redirecionando...") em uma caixa inline, não em um
    // toast -> este teste FALHA, capturando o bug.
    expect(
      await screen.findByText("E-mail enviado com sucesso")
    ).toBeInTheDocument();
  });
});
