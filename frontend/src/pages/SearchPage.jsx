import React, { useState } from "react";
import Analytics from "../components/Analytics"; // Import the Analytics component
import YouTubeAnalytics from "../components/YouTubeAnalytics"; // Import the YouTubeAnalytics component
import "../styles/SearchPage.css"; // Import the CSS file

const SearchPage = () => {
  const [searchData, setSearchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState(""); // Search keyword state
  const [selectedOption, setSelectedOption] = useState("top_searches"); // Default to Top Searches

  const handleSearch = async () => {
    if (!keyword) {
      setError("Please enter a search term.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate fetching data from API
      // const response = await fetch(`/results.json`);
      const response = await fetch(`/fetch_data`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }
      const data = await response.json();
      setSearchData(data.search);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page-container">
      <div className="full-width-container">
        {/* Options Bar Section */}
        <div className="options-bar">
          <div className="options">
            <button
              className={`option-button ${selectedOption === "top_searches" ? "selected" : ""}`}
              onClick={() => setSelectedOption("top_searches")}
            >
              Top Searches
            </button>
            <button
              className={`option-button ${selectedOption === "google_trends" ? "selected" : ""}`}
              onClick={() => setSelectedOption("google_trends")}
            >
              Google Trends
            </button>
            <button
              className={`option-button ${selectedOption === "youtube_analytics" ? "selected" : ""}`}
              onClick={() => setSelectedOption("youtube_analytics")}
            >
              YouTube Analytics
            </button>
          </div>

          {/* Conditionally render search bar only if not "youtube_analytics" */}
          {selectedOption !== "youtube_analytics" && (
            <div className="search-section">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="search-input"
                placeholder="Search..."
              />
              <button
                onClick={handleSearch}
                className="search-button"
              >
                Search
              </button>
            </div>
          )}
        </div>

        {/* HR line to separate options from content */}
        <hr className="separator" />

        {/* Error message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}

        {/* Render Analytics component if "Google Trends" is selected */}
        {selectedOption === "google_trends" && !loading && !error && (
          <Analytics keyword={keyword} searchData={searchData} />
        )}

        {/* Render search results, only if "Top Searches" is selected */}
        {selectedOption === "top_searches" && searchData && !loading && !error && (
          <div className="search-container">
            <div className="search-results">
              <p className="results-header">
                Top {searchData.organic_results.length} results for "{keyword}"
              </p>
              <div className="results-grid">
                {searchData.organic_results.map((result, index) => (
                  <div key={index} className="result-card">
                    <div className="result-thumbnail">
                      {result.thumbnail ? (
                        <img
                          src={result.thumbnail}
                          alt={result.title}
                          className="thumbnail-image"
                        />
                      ) : (
                        <img
                          src={result.favicon}
                          alt={result.title}
                          className="thumbnail-image"
                        />
                      )}
                    </div>
                    <h2 className="result-title">
                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="result-link"
                      >
                        {result.title}
                      </a>
                    </h2>
                    <p className="result-snippet">{result.snippet}</p>
                    <p className="result-source">Source: {result.source}</p>
                    <div className="result-read-more">
                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="read-more-link"
                      >
                        <span>Read more</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="arrow-icon"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Conditionally Render YouTube Analytics Data */}
        {selectedOption === "youtube_analytics" && !loading && !error && (
          <YouTubeAnalytics />
        )}
      </div>
    </div>
  );
};

export default SearchPage;
