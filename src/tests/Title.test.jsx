import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Title from "../pages/Title";

describe("Title", () => {
  it("renders the Winpoint logo", () => {
    render(<MemoryRouter><Title /></MemoryRouter>);
    expect(screen.getByAltText("Winpoint")).toBeInTheDocument();
  });

  it("renders the Play link", () => {
    render(<MemoryRouter><Title /></MemoryRouter>);
    expect(screen.getByLabelText("Play")).toBeInTheDocument();
  });

  it("renders the Sign in and Create account links", () => {
    render(<MemoryRouter><Title /></MemoryRouter>);
    expect(screen.getByLabelText("Sign in")).toBeInTheDocument();
    expect(screen.getByLabelText("Create account")).toBeInTheDocument();
  });
});