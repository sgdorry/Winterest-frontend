import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import { AuthProvider } from "../context/AuthContext";
import Title from "../pages/Title";

function renderTitle() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Title />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("Title", () => {
  beforeEach(() => {
    localStorage.removeItem("user");
  });

  it("renders the Winpoint logo", () => {
    renderTitle();
    expect(screen.getByAltText("Winpoint")).toBeInTheDocument();
  });

  it("renders the Play link", () => {
    renderTitle();
    expect(screen.getByLabelText("Play")).toBeInTheDocument();
  });

  it("renders the Sign in and Create account links when logged out", () => {
    renderTitle();
    expect(screen.getByLabelText("Sign in")).toBeInTheDocument();
    expect(screen.getByLabelText("Create account")).toBeInTheDocument();
  });

  it("links the profile image to login when logged out", () => {
    renderTitle();
    expect(screen.getByLabelText("Profile").closest("a")).toHaveAttribute(
      "href",
      "/login"
    );
  });

  it("links the profile image to profile when logged in", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ id: 7, email: "player@example.com" })
    );

    renderTitle();

    expect(screen.getByLabelText("Profile").closest("a")).toHaveAttribute(
      "href",
      "/profile"
    );
  });

  it("does not render Sign in and Create account links when logged in", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ id: 7, email: "player@example.com" })
    );

    renderTitle();

    expect(screen.queryByLabelText("Sign in")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Create account")).not.toBeInTheDocument();
  });

  it("handles corrupted stored user data as logged out", () => {
    localStorage.setItem("user", "NOT_VALID_JSON{{{");

    renderTitle();

    expect(screen.getByLabelText("Profile").closest("a")).toHaveAttribute(
      "href",
      "/login"
    );
    expect(localStorage.getItem("user")).toBeNull();
  });
});
