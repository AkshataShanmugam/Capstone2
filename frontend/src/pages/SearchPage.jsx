import React, { useState, useEffect } from "react";
import Analytics from "../components/Trends";
import YouTubeAnalytics from "../components/YouTubeAnalytics";
import "../styles/SearchPage.css";

const SearchPage = () => {
  const [searchData, setSearchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState(""); // Search keyword state
  const [youtubeUrl, setYoutubeUrl] = useState(""); // YouTube URL state
  const [selectedOption, setSelectedOption] = useState("top_searches"); // Default to Top Searches
  const [analyzeClicked, setAnalyzeClicked] = useState(false); // Track if Analyze button is clicked


  useEffect(() => {
    // Check if there's cached search data in sessionStorage and load it
    const cachedData = sessionStorage.getItem("searchData");
    const cachedDataKeyword = sessionStorage.getItem("searchDataKeyword");
    if (cachedData) {
      setSearchData(JSON.parse(cachedData)); // Parse and set the cached data
    }

    if (cachedDataKeyword){
      setKeyword(JSON.parse(cachedDataKeyword));
    }
  }, []);

  const handleSearch = async () => {
    if (!keyword) {
      setError("Please enter a search term.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // const response = await fetch(`http://localhost:8000/google/fetch_data?keyword=${encodeURIComponent(keyword)}`);
      const response = await fetch(`/results.json`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }
      const data = await response.json();
      setSearchData(data);
      sessionStorage.setItem("searchData", JSON.stringify(data)); // Store search data in sessionStorage
      sessionStorage.setItem("searchDataKeyword", JSON.stringify(keyword)); // Store search data in sessionStorage
    
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const isValidYouTubeUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return regex.test(url);
  };
  
  const handleYouTubeSubmit = () => {
    if (!youtubeUrl || !isValidYouTubeUrl(youtubeUrl)) {
      setError("Please enter a valid YouTube URL.");
      return;
    }
    setError(null);
    setAnalyzeClicked(true);
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
              className={`google_trends_graph option-button ${selectedOption === "google_trends" ? "selected" : ""}`}
              onClick={() => setSelectedOption("google_trends")}
            >
              Google Trends
            </button>
            <button
              className={`youtube_data option-button ${selectedOption === "youtube_analytics" ? "selected" : ""}`}
              onClick={() => setSelectedOption("youtube_analytics")}
            >
              YouTube Analytics
            </button>
          </div>

          {/* Conditionally render search bar for "Top Searches" or "Google Trends" */}
          {selectedOption === "top_searches" && (
            <div className="search-section">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="search-input"
                placeholder="Search..."
                id="trends-search-input"
              />
              <button onClick={handleSearch} className="search-button">
                Search
              </button>
            </div>
          )}

          {/* Input for YouTube URL when "YouTube Analytics" is selected */}
          {selectedOption === "youtube_analytics" && (
            <div className="youtube-input-section">
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="search-input"
                placeholder="Enter YouTube Video URL..."
                id="youtube-search-input"
              />
              <button onClick={handleYouTubeSubmit} className="search-button">
                Analyze
              </button>
            </div>
          )}
        </div>

        {/* HR line to separate options from content */}
        <hr className="separator" />

        {/* Error message */}
        {error && <div className="error-message">{error}</div>}

        {/* Loading Spinner */}
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}

        {/* Render Analytics component if "Google Trends" is selected */}
        {selectedOption === "google_trends" && searchData && !loading && !error && (
          <Analytics keyword={keyword} searchData={searchData} />
        )}

        {!searchData && (
          <p> Please enter your Movie Name/URL in the search field </p>
        )}

        {/* Render search results, only if "Top Searches" is selected */}
        {selectedOption === "top_searches" && searchData && !loading && !error && (
          <div className="search-container">
            <div className="search-results">
              <p className="results-header">
                Top {searchData.search.organic_results.length} results for "{keyword}"
              </p>
              <div className="results-grid">
                {searchData.search.organic_results.map((result, index) => (
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
        {selectedOption === "youtube_analytics" && analyzeClicked && youtubeUrl && isValidYouTubeUrl(youtubeUrl) && (
          <YouTubeAnalytics videoUrl={youtubeUrl} />
        )}
      </div>
    </div>
  );
};

export default SearchPage;
