import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import YouTubeData from "../../src/components/YouTubeAnalytics";
import '@testing-library/jest-dom';

// Mocking fetch function
global.fetch = vi.fn();

// Mocking sessionStorage
global.sessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};

describe("YouTubeData Component", () => {
  const videoUrl = "https://www.youtube.com/watch?v=CljcOFN8EYA";

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    render(<YouTubeData videoUrl={videoUrl} />);
    // Ensure loading text is rendered
    expect(screen.getByText(/Loading YouTube Analytics.../)).toBeInTheDocument();
  });


  it("renders the 'Overall Summary' section correctly", async () => {
    // Mock successful fetch response
    const mockData = {
      summary: "**Overall Summary:** Video is very informative. **Positive Comments:** Great video!",
      positive: 50,
      negative: 10,
      neutral: 40,
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    render(<YouTubeData videoUrl={videoUrl} />);

    // Wait for the 'Overall Summary' section to be rendered
    await waitFor(() => expect(screen.getByText(/Overall Summary/)).toBeInTheDocument());

    // Check if the overall summary text is rendered correctly
    expect(screen.getByText(/Video is very informative/)).toBeInTheDocument();
  });

  it("handles invalid response structure gracefully", async () => {
    // Mock fetch response with missing data
    fetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    });

    render(<YouTubeData videoUrl={videoUrl} />);

    await waitFor(() => expect(screen.getByText(/Invalid response structure./)).toBeInTheDocument());
  });
});
