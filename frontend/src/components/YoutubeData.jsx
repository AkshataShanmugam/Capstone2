import React, { useState, useEffect } from "react";

const YouTubeData = ({ keyword }) => {
  const [data, setData] = useState(null); // To store the fetched data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the YouTube data on component mount
  useEffect(() => {
    const fetchYouTubeData = async () => {
      try {
        const response = await fetch("/sample_result.json"); // Path to the JSON file
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const result = await response.json();
        setData(result); // Store the fetched data in state
      } catch (err) {
        setError("Error fetching YouTube analytics data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchYouTubeData();
  }, []); // Empty dependency array to run once on mount

  if (loading) {
    return <div>Loading YouTube Analytics...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="youtube-data-container">
      <h2>YouTube Analytics for "{keyword}"</h2>
      
      <div className="comment-section">
        <div className="positive-comments">
          <h3>Positive Comments: {data.positive}</h3>
          <p>{data.summary.split("**Negative Comments**")[0]}</p>
        </div>

        <div className="negative-comments">
          <h3>Negative Comments: {data.negative}</h3>
          <p>{data.summary.split("**Neutral Comments**")[0].split("**Negative Comments**")[1]}</p>
        </div>

        <div className="neutral-comments">
          <h3>Neutral Comments: {data.neutral}</h3>
          <p>{data.summary.split("**Overall Summary**")[0].split("**Neutral Comments**")[1]}</p>
        </div>
      </div>

      <div className="overall-summary">
        <h3>Overall Summary</h3>
        <p>{data.summary.split("**Overall Summary**")[1]}</p>
      </div>
    </div>
  );
};

export default YouTubeData;
