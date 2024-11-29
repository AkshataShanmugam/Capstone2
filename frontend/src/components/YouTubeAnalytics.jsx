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
    return <div className="text-center text-xl text-gray-500">Loading YouTube Analytics...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  // Helper function to render list items dynamically from the data
  const renderListItems = (data) => {
    return data.map((item, index) => <li key={index} className="text-gray-700">{item}</li>);
  };

  // Helper function to extract sections from the summary string in the JSON data
  const extractSummarySection = (sectionTitle) => {
    const section = data.summary.split(`**${sectionTitle}**`);
    return section[1] ? section[1].split("**")[0] : '';
  };

  // Remove the first line if it matches the title
  const cleanSummary = (sectionContent, title) => {
    const lines = sectionContent.split("\n").filter(item => item);
    if (lines[0] === title) {
      lines.shift(); // Remove the title line if it matches
    }
    return lines;
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        YouTube Analytics for <span className="font-bold text-gray-600">"{keyword}"</span>
      </h2>

      <div className="comment-section mb-8">
        {/* Positive Comments Section */}
        <div className="positive-comments mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
          <h3 className="text-2xl font-bold text-green-600 mb-3">
            Positive Comments: {data.positive}
          </h3>
          <p className="text-lg font-semibold">Key themes or common points:</p>
          <ul className="list-disc pl-6 space-y-2">
            {renderListItems(cleanSummary(extractSummarySection("Positive Comments"), "Key themes or common points:"))}
          </ul>
          <p className="mt-3 text-gray-700">
            <strong>Summary:</strong> {extractSummarySection("Positive Comments")}
          </p>
        </div>

        <hr className="my-6 border-t border-gray-300" />

        {/* Negative Comments Section */}
        <div className="negative-comments mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <h3 className="text-2xl font-bold text-red-600 mb-3">
            Negative Comments: {data.negative}
          </h3>
          <p className="text-lg font-semibold">Key criticisms or issues:</p>
          <ul className="list-disc pl-6 space-y-2">
            {renderListItems(cleanSummary(extractSummarySection("Negative Comments"), "Key criticisms or issues:"))}
          </ul>
          <p className="mt-3 text-gray-700">
            <strong>Summary:</strong> {extractSummarySection("Negative Comments")}
          </p>
        </div>

        <hr className="my-6 border-t border-gray-300" />

        {/* Neutral Comments Section */}
        <div className="neutral-comments mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
          <h3 className="text-2xl font-bold text-yellow-600 mb-3">
            Neutral Comments: {data.neutral}
          </h3>
          <p className="text-lg font-semibold">Key observations or comments:</p>
          <ul className="list-disc pl-6 space-y-2">
            {renderListItems(cleanSummary(extractSummarySection("Neutral Comments"), "Key observations or comments:"))}
          </ul>
          <p className="mt-3 text-gray-700">
            <strong>Summary:</strong> {extractSummarySection("Neutral Comments")}
          </p>
        </div>
      </div>

      {/* Overall Summary */}
      <div className="overall-summary p-4 bg-gray-50 border-l-4 border-gray-300 rounded-lg">
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Overall Summary</h3>
        <p className="text-gray-700">{extractSummarySection("Overall Summary")}</p>
      </div>
    </div>
  );
};

export default YouTubeData;
