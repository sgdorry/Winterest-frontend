import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar/Navbar";

function renderNavbar() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("Navbar", () => {
  beforeEach(() => {
    localStorage.removeItem("user");
  });

  describe("nav links (always visible)", () => {
    it("renders the Home link", () => {
      renderNavbar();
      expect(screen.getByText("Home")).toBeInTheDocument();
    });

    it("renders the Play link", () => {
      renderNavbar();
      expect(screen.getByText("Play")).toBeInTheDocument();
    });

    it("renders the Leaderboard link", () => {
      renderNavbar();
      expect(screen.getByText("Leaderboard")).toBeInTheDocument();
    });

    it("renders the How to Play link", () => {
      renderNavbar();
      expect(screen.getByText("How to Play")).toBeInTheDocument();
    });

    it("renders nav links when user is logged in", () => {
      localStorage.setItem("user", JSON.stringify({ id: 1, email: "a@b.com" }));
      renderNavbar();
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Play")).toBeInTheDocument();
      expect(screen.getByText("Leaderboard")).toBeInTheDocument();
      expect(screen.getByText("How to Play")).toBeInTheDocument();
    });
  });

  describe("logged-out account area", () => {
    it("shows Log In and Sign Up when no user", () => {
      renderNavbar();
      expect(screen.getByText("Log In")).toBeInTheDocument();
      expect(screen.getByText("Sign Up")).toBeInTheDocument();
    });

    it("does not show Profile button when no user", () => {
      renderNavbar();
      expect(screen.queryByText("Profile")).not.toBeInTheDocument();
    });

    it("Log In links to /login", () => {
      renderNavbar();
      const loginLink = screen.getByText("Log In");
      expect(loginLink.closest("a")).toHaveAttribute("href", "/login");
    });

    it("Sign Up links to /signup", () => {
      renderNavbar();
      const signupLink = screen.getByText("Sign Up");
      expect(signupLink.closest("a")).toHaveAttribute("href", "/signup");
    });
  });

  describe("logged-in account area", () => {
    beforeEach(() => {
      localStorage.setItem("user", JSON.stringify({ id: 1, email: "a@b.com" }));
    });

    it("shows Profile button when user is logged in", () => {
      renderNavbar();
      expect(screen.getByText("Profile")).toBeInTheDocument();
    });

    it("does not show Log In or Sign Up when user is logged in", () => {
      renderNavbar();
      expect(screen.queryByText("Log In")).not.toBeInTheDocument();
      expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();
    });

    it("Profile button has aria-haspopup", () => {
      renderNavbar();
      const profileBtn = screen.getByText("Profile");
      expect(profileBtn).toHaveAttribute("aria-haspopup", "true");
    });

    it("dropdown contains View Profile and Log Out", () => {
      renderNavbar();
      const menu = screen.getByRole("menu");
      expect(within(menu).getByText("View Profile")).toBeInTheDocument();
      expect(within(menu).getByText("Log Out")).toBeInTheDocument();
    });

    it("View Profile links to /profile", () => {
      renderNavbar();
      const viewProfile = screen.getByText("View Profile");
      expect(viewProfile.closest("a")).toHaveAttribute("href", "/profile");
    });

    it("Log Out clears user from localStorage", async () => {
      renderNavbar();
      const logoutBtn = screen.getByText("Log Out");
      await userEvent.click(logoutBtn);
      expect(localStorage.getItem("user")).toBeNull();
    });

    it("after Log Out, navbar shows Log In and Sign Up", async () => {
      renderNavbar();
      await userEvent.click(screen.getByText("Log Out"));
      expect(screen.getByText("Log In")).toBeInTheDocument();
      expect(screen.getByText("Sign Up")).toBeInTheDocument();
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });
});
