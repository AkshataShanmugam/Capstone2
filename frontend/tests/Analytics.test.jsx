import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import Analytics from "../src/components/Trends";
import Map from "../src/components/Map";

// Mock Map component
vi.mock("../src/components/Map", () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="mock-map">Mock Map Component</div>),
}));

// Mock react-chartjs-2
vi.mock("react-chartjs-2", () => ({
  Line: vi.fn(() => <canvas aria-label="chart" />),
}));

describe("Analytics Component", () => {
  const mockKeyword = "example keyword";
  const mockSearchData = {
    trends: {
      interest_over_time: {
        timeline_data: [
          { date: "2023-01-01", values: [{ value: "50" }] },
          { date: "2023-01-02", values: [{ value: "75" }] },
        ],
      },
    },
  };

  test("renders the component without crashing", () => {
    render(<Analytics keyword={mockKeyword} searchData={mockSearchData} />);
    expect(screen.getByText(/interest over time for/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`"${mockKeyword}"`, "i"))).toBeInTheDocument();
  });

  test("renders the Map component with correct props", () => {
    render(<Analytics keyword={mockKeyword} searchData={mockSearchData} />);
    const mapComponent = screen.getByTestId("mock-map");
    expect(mapComponent).toBeInTheDocument();
    expect(Map).toHaveBeenCalledWith(
      { keyword: mockKeyword, searchData: mockSearchData },
      expect.anything()
    );
  });
});
