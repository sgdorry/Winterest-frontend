import React from 'react'
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { AuthProvider } from "../context/AuthContext";
import Leaderboard from "../pages/Leaderboard";

vi.mock("../api/scores", () => ({
  fetchAggregatedFriendsLeaderboard: vi.fn(() => Promise.resolve([])),
}));

vi.mock("../api/friends", () => ({
  addFriend: vi.fn(),
  removeFriend: vi.fn(),
  fetchFriends: vi.fn(() => Promise.resolve([])),
}));

function renderLeaderboard() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Leaderboard />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("Leaderboard", () => {
  it("renders the Leaderboard heading", () => {
    renderLeaderboard();
    expect(screen.getByText("Leaderboard")).toBeInTheDocument();
  });

  it("renders the Play and Back to Home links", () => {
    renderLeaderboard();
    expect(screen.getByText("Play")).toBeInTheDocument();
    expect(screen.getByText("Back to Home")).toBeInTheDocument();
  });

  it("renders the Rankings section", () => {
    renderLeaderboard();
    expect(screen.getByText("Rankings")).toBeInTheDocument();
  });
});