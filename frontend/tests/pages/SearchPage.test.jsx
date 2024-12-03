import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import '@testing-library/jest-dom';
import SearchPage from "../../src/pages/SearchPage";

// Mock fetch to simulate the API call
global.fetch = vi.fn();

describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  test("renders the search input and buttons", () => {
    render(<SearchPage />);

    // Check if the search input and buttons are rendered
    expect(screen.getByPlaceholderText(/search.../i)).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4); // Ensure there are 4 buttons
    expect(buttons[0]).toHaveTextContent(/Top Searches/i);
    expect(buttons[1]).toHaveTextContent(/Google Trends/i);
    expect(buttons[2]).toHaveTextContent(/YouTube Analytics/i);
    expect(buttons[3]).toHaveTextContent(/Search/i);
  });

  test("handles keyword search input", () => {
    render(<SearchPage />);

    const input = screen.getByPlaceholderText(/search.../i);
    fireEvent.change(input, { target: { value: "test" } });
    expect(input.value).toBe("test");
  });

  test("validates YouTube URL input", () => {
    render(<SearchPage />);

    // Switch to YouTube Analytics option
    const youtubeButton = screen.getByText(/YouTube Analytics/i);
    fireEvent.click(youtubeButton);

    const youtubeInput = screen.getByPlaceholderText(/enter youtube video url.../i);
    fireEvent.change(youtubeInput, { target: { value: "invalid_url" } });

    const analyzeButton = screen.getByText(/Analyze/i);
    fireEvent.click(analyzeButton);

    expect(screen.getByText(/please enter a valid youtube url/i)).toBeInTheDocument();
  });
});
