import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Navbar from "../components/Navbar/Navbar";

describe("Navbar", () => {
  it("renders the Home link", () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("renders the Leaderboard link", () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(screen.getByText("Leaderboard")).toBeInTheDocument();
  });

  it("renders the How to Play link", () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(screen.getByText("How to Play")).toBeInTheDocument();
  });
});