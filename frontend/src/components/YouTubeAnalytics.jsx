import React, { useState, useEffect } from "react";

const YouTubeData = ({ videoUrl }) => {
  const [data, setData] = useState(null); // To store the fetched data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchYouTubeData = async () => {
      try {
        // const response = await fetch(`http://192.168.255.104:8000/youtube/analyze-sentiment/`, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ video_url: videoUrl }),
        // });

        const response = await fetch('youtube_results.json'); // Fetch local JSON file

        console.log(response)
    
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
    
        const result = await response.json();
        console.log("Response JSON:", result);
        if (!result.positive || !result.negative) {
          throw new Error("Invalid response structure.");
        }
    
        setData(result);
      } catch (err) {
        setError(err.message || "Error fetching YouTube analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchYouTubeData();
  }, [videoUrl]); // Dependency array includes `videoUrl`

  if (loading) {
    return <div className="text-center text-xl text-gray-500">Loading YouTube Analytics...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  const renderListItems = (data) => {
    return data.map((item, index) => (
      <li key={index} className="text-gray-700">
        {item}
      </li>
    ));
  };
  
  // Helper function to extract sections from the summary string in the JSON data
  const extractSummarySection = (sectionTitle) => {
    const sectionRegex = new RegExp(`\\*\\*${sectionTitle}:\\*\\*(.*?)\\*\\*`, 's');
    const match = data.summary.match(sectionRegex);
    return match ? match[1].trim() : '';
  };
  
  // Helper function to clean and format the summary for list rendering
  const cleanSummary = (sectionContent) => {
    return sectionContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("*")) // Only include bullet points
      .map((line) => line.replace(/^\*+\s*/, "")); // Remove the leading '*'
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        YouTube Analytics for <span className="font-bold text-gray-600">"{videoUrl}"</span>
      </h2>

      <div className="comment-section mb-8">
        {/* Positive Comments Section */}
        <div className="positive-comments mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
          <h3 className="text-2xl font-bold text-green-600 mb-3">
            Positive Comments: {data.positive}
          </h3>
          <p className="text-lg font-semibold">Key themes or common points:</p>
          <ul className="list-disc pl-6 space-y-2">
          {renderListItems(cleanSummary(extractSummarySection("Positive Comments")))}
          </ul>
        </div>

        <hr className="my-6 border-t border-gray-300" />

        {/* Negative Comments Section */}
        <div className="negative-comments mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <h3 className="text-2xl font-bold text-red-600 mb-3">
            Negative Comments: {data.negative}
          </h3>
          <p className="text-lg font-semibold">Key criticisms or issues:</p>
          <ul className="list-disc pl-6 space-y-2">
            {renderListItems(cleanSummary(extractSummarySection("Negative Comments"), "Key criticisms:"))}
          </ul>
        </div>

        <hr className="my-6 border-t border-gray-300" />

        {/* Neutral Comments Section */}
        <div className="neutral-comments mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
          <h3 className="text-2xl font-bold text-yellow-600 mb-3">
            Neutral Comments: {data.neutral}
          </h3>
          <p className="text-lg font-semibold">Key observations or comments:</p>
          <ul className="list-disc pl-6 space-y-2">
            {renderListItems(cleanSummary(extractSummarySection("Neutral Observations"), "Key observations:"))}
          </ul>
        </div>
      </div>

      {/* Overall Summary */}
      <div className="overall-summary p-4 bg-gray-50 border-l-4 border-gray-300 rounded-lg">
          <p className="text-lg font-semibold">Overall Summary:</p>
          <ul className="list-disc pl-6 space-y-2">
            {renderListItems(cleanSummary(extractSummarySection("Neutral Observations"), "Key observations:"))}
          </ul>
      </div>
    </div>
  );
};

export default YouTubeData;