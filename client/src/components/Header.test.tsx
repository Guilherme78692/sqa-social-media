import { render, screen } from "@testing-library/react";
import Header from "./Header";

// Mocks das dependências externas para isolar o componente Header
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from "@/contexts/AuthContext";

describe("Header (componente isolado)", () => {
  test('deve exibir os botões "Entrar" e "Criar Conta" quando o usuário está deslogado', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      logout: jest.fn(),
    });

    render(<Header />);

    expect(screen.getByText("Entrar")).toBeInTheDocument();
    expect(screen.getByText("Criar Conta")).toBeInTheDocument();
    expect(screen.queryByText("Sair")).not.toBeInTheDocument();
    expect(screen.queryByText("Posts Curtidos")).not.toBeInTheDocument();
  });
});
