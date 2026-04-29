import React from 'react'
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Game from "../components/Game";

const mockEntity = {
  name: "France",
  hints: ["This country is in Europe.", "It is known for the Eiffel Tower.", "Its capital is Paris."],
};

function renderGame(props = {}) {
  return render(
    <MemoryRouter>
      <Game
        entityType="countries"
        targetEntity={mockEntity}
        allEntities={[]}
        onReset={vi.fn()}
        onGameEnd={vi.fn()}
        {...props}
      />
    </MemoryRouter>
  );
}

describe("Game", () => {
  it("renders the Play button initially", () => {
    renderGame();
    expect(screen.getByText("Play")).toBeInTheDocument();
  });

  it("shows the first hint after clicking Play", () => {
    renderGame();
    fireEvent.click(screen.getByText("Play"));
    expect(screen.getByText("This country is in Europe.")).toBeInTheDocument();
  });

  it("shows Submit Guess button after clicking Play", () => {
    renderGame();
    fireEvent.click(screen.getByText("Play"));
    expect(screen.getByText("Submit Guess")).toBeInTheDocument();
  });

  it("shows won message when correct answer is submitted", () => {
    renderGame();
    fireEvent.click(screen.getByText("Play"));
    const input = screen.getByLabelText("Guess 1");
    fireEvent.change(input, { target: { value: "France" } });
    fireEvent.submit(input.closest("form"));
    expect(screen.getByText(/You won!/)).toBeInTheDocument();
  });

  it("shows Play Again button after winning", () => {
    renderGame();
    fireEvent.click(screen.getByText("Play"));
    const input = screen.getByLabelText("Guess 1");
    fireEvent.change(input, { target: { value: "France" } });
    fireEvent.submit(input.closest("form"));
    expect(screen.getByText("Play Again")).toBeInTheDocument();
  });

  it("calls onReset when Play Again is clicked", () => {
    const onReset = vi.fn();
    renderGame({ onReset });
    fireEvent.click(screen.getByText("Play"));
    const input = screen.getByLabelText("Guess 1");
    fireEvent.change(input, { target: { value: "France" } });
    fireEvent.submit(input.closest("form"));
    fireEvent.click(screen.getByText("Play Again"));
    expect(onReset).toHaveBeenCalled();
  });
});