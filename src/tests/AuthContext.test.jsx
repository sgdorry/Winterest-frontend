import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "../context/AuthContext";

function AuthConsumer() {
  const { user, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? JSON.stringify(user) : "null"}</span>
      <button onClick={() => login({ id: 42, email: "test@example.com" })}>
        log in
      </button>
      <button onClick={logout}>log out</button>
    </div>
  );
}

function renderWithAuth() {
  return render(
    <AuthProvider>
      <AuthConsumer />
    </AuthProvider>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.removeItem("user");
  });

  it("returns null user when localStorage is empty", () => {
    renderWithAuth();
    expect(screen.getByTestId("user").textContent).toBe("null");
  });

  it("returns user when localStorage has a valid user", () => {
    localStorage.setItem("user", JSON.stringify({ id: 1, email: "a@b.com" }));
    renderWithAuth();
    expect(screen.getByTestId("user").textContent).toContain('"id":1');
    expect(screen.getByTestId("user").textContent).toContain('"email":"a@b.com"');
  });

  it("returns null when localStorage user has no id", () => {
    localStorage.setItem("user", JSON.stringify({ email: "no-id@b.com" }));
    renderWithAuth();
    expect(screen.getByTestId("user").textContent).toBe("null");
  });

  it("login() updates user state and writes to localStorage", () => {
    renderWithAuth();
    expect(screen.getByTestId("user").textContent).toBe("null");

    act(() => {
      screen.getByText("log in").click();
    });

    expect(screen.getByTestId("user").textContent).toContain('"id":42');
    const stored = JSON.parse(localStorage.getItem("user"));
    expect(stored).toEqual({ id: 42, email: "test@example.com" });
  });

  it("logout() clears user state and removes from localStorage", () => {
    localStorage.setItem("user", JSON.stringify({ id: 1, email: "a@b.com" }));
    renderWithAuth();
    expect(screen.getByTestId("user").textContent).toContain('"id":1');

    act(() => {
      screen.getByText("log out").click();
    });

    expect(screen.getByTestId("user").textContent).toBe("null");
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("handles corrupted localStorage gracefully", () => {
    localStorage.setItem("user", "NOT_VALID_JSON{{{");
    renderWithAuth();
    expect(screen.getByTestId("user").textContent).toBe("null");
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("throws when useAuth is used outside AuthProvider", () => {
    expect(() => render(<AuthConsumer />)).toThrow(
      "useAuth must be used within an AuthProvider"
    );
  });
});
