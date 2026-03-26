import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Rules from "../pages/Rules";

describe("Rules", () => {
  it("renders the How to Play heading", () => {
    render(<MemoryRouter><Rules /></MemoryRouter>);
    expect(screen.getByText("How to Play")).toBeInTheDocument();
  });

  it("renders the scoring table with 500 points for 1st guess", () => {
    render(<MemoryRouter><Rules /></MemoryRouter>);
    expect(screen.getByText("1st guess")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
  });

  it("renders the Play and Back links", () => {
    render(<MemoryRouter><Rules /></MemoryRouter>);
    expect(screen.getByText("Play")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
  });
});