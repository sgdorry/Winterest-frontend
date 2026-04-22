import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuthProvider } from "../context/AuthContext";
import Profile from "../pages/Profile";

vi.mock("../api/scores", () => ({
  fetchLeaderboard: vi.fn(),
}));

vi.mock("../api/users", () => ({
  updateUsername: vi.fn(),
}));

import { fetchLeaderboard } from "../api/scores";
import { updateUsername } from "../api/users";

function renderProfile() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Profile />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("Profile", () => {
  beforeEach(() => {
    localStorage.removeItem("user");
    vi.clearAllMocks();
  });

  describe("logged out", () => {
    it("shows login prompt when no user", () => {
      renderProfile();
      expect(screen.getByText("You need to be logged in to view your profile.")).toBeInTheDocument();
    });

    it("shows Log In and Sign Up links", () => {
      renderProfile();
      const loginLink = screen.getByText("Log In");
      const signupLink = screen.getByText("Sign Up");
      expect(loginLink.closest("a")).toHaveAttribute("href", "/login");
      expect(signupLink.closest("a")).toHaveAttribute("href", "/signup");
    });

    it("does not fetch scores when logged out", () => {
      renderProfile();
      expect(fetchLeaderboard).not.toHaveBeenCalled();
    });
  });

  describe("logged in", () => {
    beforeEach(() => {
      localStorage.setItem("user", JSON.stringify({ id: 7, email: "player@winpoint.com" }));
    });

    it("shows the user email", async () => {
      fetchLeaderboard.mockResolvedValue([]);
      renderProfile();
      expect(screen.getByText("player@winpoint.com")).toBeInTheDocument();
      await waitFor(() => expect(fetchLeaderboard).toHaveBeenCalled());
    });

    it("shows Your Profile heading", async () => {
      fetchLeaderboard.mockResolvedValue([]);
      renderProfile();
      expect(screen.getByText("Your Profile")).toBeInTheDocument();
      await waitFor(() => expect(fetchLeaderboard).toHaveBeenCalled());
    });

    it("shows empty state when user has no scores", async () => {
      fetchLeaderboard.mockResolvedValue([]);
      renderProfile();
      await waitFor(() => {
        expect(screen.getByText("No games played yet.")).toBeInTheDocument();
      });
    });

    it("shows Play Now link in empty state", async () => {
      fetchLeaderboard.mockResolvedValue([]);
      renderProfile();
      await waitFor(() => {
        const playLink = screen.getByText("Play Now");
        expect(playLink.closest("a")).toHaveAttribute("href", "/play");
      });
    });

    it("shows user scores filtered from leaderboard", async () => {
      fetchLeaderboard.mockResolvedValue([
        { id: 1, user_id: 7, player: "player@winpoint.com", score: 500, guesses_used: 1, entity_type: "countries" },
        { id: 2, user_id: 7, player: "player@winpoint.com", score: 300, guesses_used: 3, entity_type: "states" },
        { id: 3, user_id: 99, player: "other@example.com", score: 400, guesses_used: 2, entity_type: "cities" },
      ]);
      renderProfile();

      await waitFor(() => {
        const table = screen.getByRole("table");
        const rows = within(table).getAllByRole("row");
        expect(rows).toHaveLength(3);
        expect(within(rows[1]).getByText("500")).toBeInTheDocument();
        expect(within(rows[2]).getByText("300")).toBeInTheDocument();
      });

      expect(screen.queryByText("400")).not.toBeInTheDocument();
    });

    it("shows stats when user has scores", async () => {
      fetchLeaderboard.mockResolvedValue([
        { id: 1, user_id: 7, score: 500, guesses_used: 1, entity_type: "countries" },
        { id: 2, user_id: 7, score: 300, guesses_used: 3, entity_type: "countries" },
      ]);
      renderProfile();

      await waitFor(() => {
        expect(screen.getByText("Games Played")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
        expect(screen.getByText("800")).toBeInTheDocument();
        expect(screen.getByText("Best Score")).toBeInTheDocument();
      });
    });

    it("shows error message when fetch fails", async () => {
      fetchLeaderboard.mockRejectedValue(new Error("Network error"));
      renderProfile();

      await waitFor(() => {
        expect(screen.getByText("Network error")).toBeInTheDocument();
      });
    });

    it("shows loading state", () => {
      fetchLeaderboard.mockReturnValue(new Promise(() => {}));
      renderProfile();
      expect(screen.getByText("Loading scores…")).toBeInTheDocument();
    });

    it("keeps username input hidden until Edit is clicked", async () => {
      fetchLeaderboard.mockResolvedValue([]);
      renderProfile();

      await waitFor(() => {
        expect(fetchLeaderboard).toHaveBeenCalled();
      });

      expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
      expect(screen.queryByLabelText("New Username")).not.toBeInTheDocument();
    });

    it("updates username from profile form", async () => {
      fetchLeaderboard.mockResolvedValue([]);
      updateUsername.mockResolvedValue({
        user: { id: 7, email: "player@winpoint.com", username: "new_name" },
      });
      renderProfile();

      await waitFor(() => expect(fetchLeaderboard).toHaveBeenCalled());

      fireEvent.click(screen.getByRole("button", { name: "Edit" }));
      const input = screen.getByLabelText("New Username");
      fireEvent.change(input, { target: { value: "new_name" } });
      fireEvent.submit(input.closest("form"));

      await waitFor(() => {
        expect(updateUsername).toHaveBeenCalledWith(7, "new_name");
      });
      expect(screen.getByText("Username updated.")).toBeInTheDocument();
    });

    it("blocks invalid username and does not call api", async () => {
      fetchLeaderboard.mockResolvedValue([]);
      renderProfile();

      await waitFor(() => expect(fetchLeaderboard).toHaveBeenCalled());

      fireEvent.click(screen.getByRole("button", { name: "Edit" }));
      const input = screen.getByLabelText("New Username");
      fireEvent.change(input, { target: { value: "bad name" } });
      fireEvent.submit(input.closest("form"));

      expect(
        screen.getByText("Username can only include letters, numbers, and underscores.")
      ).toBeInTheDocument();
      expect(updateUsername).not.toHaveBeenCalled();
    });
  });
});
