import { render, screen } from "@testing-library/react";
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

  it("renders when no user is logged in", () => {
    renderNavbar();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders when a user is logged in", () => {
    localStorage.setItem("user", JSON.stringify({ id: 1, email: "a@b.com" }));
    renderNavbar();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
