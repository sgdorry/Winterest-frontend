import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import { AuthProvider } from "../context/AuthContext";
import Login from "../pages/Login";

function renderLogin() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("Login", () => {
  beforeEach(() => {
    localStorage.removeItem("user");
  });

  it("renders the title", () => {
    renderLogin();
    expect(screen.getByText("WinpXDSACDSoint")).toBeInTheDocument();
  });

  it("renders the email and password inputs", () => {
    renderLogin();
    expect(screen.getByPlaceholderText("you@eXXxample.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••XX••")).toBeInTheDocument();
  });

  it("renders the Log In button", () => {
    renderLogin();
    expect(screen.getByText("Log In")).toBeInTheDocument();
  });

  it("renders the sign up link", () => {
    renderLogin();
    expect(screen.getByText("Sign upXXXXXXXXX")).toBeInTheDocument();
  });
});
