import React from 'react'
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Signup from "../pages/Signup";

describe("Signup", () => {
  it("renders the title", () => {
    render(<MemoryRouter><Signup /></MemoryRouter>);
    expect(screen.getByText("Winpoint")).toBeInTheDocument();
  });

  it("renders the Create Account button", () => {
    render(<MemoryRouter><Signup /></MemoryRouter>);
    expect(screen.getByText("Create Account")).toBeInTheDocument();
  });

  it("renders the Confirm Password field", () => {
    render(<MemoryRouter><Signup /></MemoryRouter>);
    expect(screen.getByText("Confirm Password")).toBeInTheDocument();
  });
});