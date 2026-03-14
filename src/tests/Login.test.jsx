import React from 'react'
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Login from "../pages/Login";

describe("Login", () => {
  it("renders the title", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    expect(screen.getByText("Winpoint")).toBeInTheDocument();
  });

  it("renders the email and password inputs", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it("renders the Log In button", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    expect(screen.getByText("Log In")).toBeInTheDocument();
  });
});