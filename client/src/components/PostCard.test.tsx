import { render, screen, fireEvent } from "@testing-library/react";
import PostCard from "./PostCard";
import { Post } from "@/service/types";

describe("PostCard (componente isolado)", () => {
  const mockPost: Post = {
    id: 1,
    title: "Título de teste",
    body: "Corpo do post de teste",
    liked: false,
  };

  test("deve exibir um alert nativo com a mensagem correta ao clicar em Curtir sem estar autenticado", () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    const onLikeMock = jest.fn();

    render(
      <PostCard post={mockPost} isAuthenticated={false} onLike={onLikeMock} />
    );

    fireEvent.click(screen.getByText("Curtir"));

    expect(alertMock).toHaveBeenCalledWith(
      "Você precisa estar autenticado para curtir posts!"
    );
    // Como o usuário não está autenticado, a função de curtir não deve ser chamada
    expect(onLikeMock).not.toHaveBeenCalled();

    alertMock.mockRestore();
  });
});
