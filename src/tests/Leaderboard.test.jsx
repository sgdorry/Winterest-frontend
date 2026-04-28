import React from 'react'
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";
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

import { fetchAggregatedFriendsLeaderboard } from "../api/scores";

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
  beforeEach(() => {
    localStorage.removeItem("user");
    vi.clearAllMocks();
  });

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

  it("shows a logged-out message and does not fetch scores without a user", async () => {
    renderLeaderboard();

    expect(
      await screen.findByText("Log in to see scores from you and your friends.")
    ).toBeInTheDocument();
    expect(fetchAggregatedFriendsLeaderboard).not.toHaveBeenCalled();
  });

  it("fetches scores for the logged-in user", async () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ id: 7, email: "player@example.com" })
    );

    renderLeaderboard();

    await waitFor(() => {
      expect(fetchAggregatedFriendsLeaderboard).toHaveBeenCalledWith(7, "all");
    });
    expect(
      await screen.findByText("No scores yet. Add friends and play some games!")
    ).toBeInTheDocument();
  });
});
