import React from 'react'
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider } from "../context/AuthContext";
import GamePage from "../pages/GamePage";

vi.mock("../api/geo", () => ({
  fetchCities: vi.fn(),
  fetchStates: vi.fn(),
  fetchCountries: vi.fn(),
}));

vi.mock("../api/scores", () => ({
  submitScore: vi.fn(),
}));

import { fetchCountries } from "../api/geo";

function renderGamePage() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <GamePage />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("GamePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the game select screen initially", () => {
    renderGamePage();
    expect(screen.getByText("Please select a game mode to start the game.")).toBeInTheDocument();
  });

  it("renders three game mode buttons", () => {
    renderGamePage();
    expect(screen.getByLabelText("Countries")).toBeInTheDocument();
    expect(screen.getByLabelText("States")).toBeInTheDocument();
    expect(screen.getByLabelText("Cities")).toBeInTheDocument();
  });

  it("shows loading after selecting a game mode", async () => {
    fetchCountries.mockReturnValue(new Promise(() => {}));
    renderGamePage();
    fireEvent.click(screen.getByLabelText("Countries"));
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows error when fetch fails", async () => {
    fetchCountries.mockRejectedValue(new Error("Network error"));
    renderGamePage();
    fireEvent.click(screen.getByLabelText("Countries"));
    await waitFor(() => {
      expect(screen.getByText("Data could not be loaded.")).toBeInTheDocument();
    });
  });

  it("shows game when data loads successfully", async () => {
    fetchCountries.mockResolvedValue([
      { name: "France", hints: ["Hint 1", "Hint 2"] },
    ]);
    renderGamePage();
    fireEvent.click(screen.getByLabelText("Countries"));
    await waitFor(() => {
      expect(screen.getByText("Play")).toBeInTheDocument();
    });
  });
});