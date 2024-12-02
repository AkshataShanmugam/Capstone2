import React, { useState, useEffect } from "react";

const YouTubeData = ({ videoUrl }) => {
  const [youtubeUrl, setYoutubeUrl] = useState(videoUrl); // YouTube URL state
  const [data, setData] = useState(null); // To store the fetched data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(videoUrl);
  
  useEffect(() => {
    // Check if there's cached search data in sessionStorage and load it
    const cachedData = sessionStorage.getItem("youtubeData");
    const cachedDataKeyword = sessionStorage.getItem("youtubeURL");
    if (cachedData) {
      setData(JSON.parse(cachedData)); // Parse and set the cached data
      setLoading(false); 
    }

    if (cachedDataKeyword){
      setYoutubeUrl(JSON.parse(cachedDataKeyword));
    }
  }, []);

  // Fetch the YouTube data on component mount
  useEffect(() => {
    const fetchYouTubeData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/youtube/analyze-sentiment/`, {
        // const response = await fetch("/youtube_results.json", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({ video_url: "https://www.youtube.com/watch?v=CljcOFN8EYA" }),
          body: JSON.stringify({ video_url: youtubeUrl }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const result = await response.json();
        console.log("Response JSON:", result);

        if (!result.positive || !result.negative) {
          throw new Error("Invalid response structure.");
        }

        setData(result);
        sessionStorage.setItem("youtubeData", JSON.stringify(result)); // Store YouTube data in sessionStorage   
        sessionStorage.setItem("youtubeURL", JSON.stringify(youtubeUrl)); // Store YouTube URL in sessionStorage     
      } catch (err) {
        setError(err.message || "Error fetching YouTube analytics data.");
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

  // Helper function to clean up the content by removing the asterisks
  const cleanAsterisks = (content) => {
    return content.replace(/\*/g, '').trim(); // Remove all '*' characters
  };

  // Helper function to extract a section based on its title
  const extractSection = (sectionTitle) => {
    const regex = new RegExp(`\\*\\*${sectionTitle}:\\*\\*([\\s\\S]*?)(?=\\*\\*|$)`, "i");
    const match = data.summary.match(regex);
    if (match) {
      let sectionContent = match[1].trim();

      // Clean up asterisks from the section content
      sectionContent = cleanAsterisks(sectionContent);

      // Remove the first line from the section content
      const lines = sectionContent.split("\n");
      lines.shift(); // Remove the first line
      sectionContent = lines.join("\n").trim(); // Rejoin the remaining lines

      return sectionContent;
    }
    return ""; // Return empty if no match
  };

  // Function to render the section content with enhanced "Summary" style
  const renderSection = (sectionName, bgColor, borderColor, textColor) => {
    const sectionContent = extractSection(sectionName);
    if (!sectionContent) return null;

    // Separate points from the summary
    const sectionContentWithoutSummary = sectionContent.split("Summary:")[0]; // Get points only
    const summaryText = sectionContent.split("Summary:")[1]?.trim(); // Get the summary only

    // Render the content with points as bullet list and summary as highlighted paragraph
    return (
      <div className={`${bgColor} ${borderColor} mb-6 p-4 border-l-4 rounded-lg`}>
        <h3 className={`text-2xl font-bold ${textColor} mb-3`}>{sectionName}</h3>

        {/* Render points as a list */}
        <ul className="list-disc pl-6 space-y-2 text-gray-800">
          {sectionContentWithoutSummary
            .split("\n")
            .filter(line => line.trim() !== "")  // Remove empty lines
            .map((line, index) => (
              <li key={index}>{line.trim()}</li>
            ))}
        </ul>

        {/* Render summary as a separate highlighted paragraph */}
        {summaryText && (
          <p className="mt-4 p-2 bg-yellow-50 rounded-lg font-semibold text-indigo-700">
            <strong>Summary:</strong> {summaryText}
          </p>
        )}
      </div>
    );
  };

  // Render the overall summary section
  const renderOverallSummary = () => {
    const overallSummary = data.summary.match(/(\*\*Overall Summary:\*\*)([\s\S]*?)(?=\*\*|$)/i);
    if (overallSummary) {
      let overallSummaryContent = overallSummary[2].trim();
      overallSummaryContent = cleanAsterisks(overallSummaryContent); // Clean asterisks

      return (
        <div className="bg-blue-50 border-blue-500 mb-6 p-4 border-l-4 rounded-lg">
          <h3 className="text-2xl font-bold text-blue-600 mb-3">Overall Summary</h3>
          <p className="text-gray-800">{overallSummaryContent}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        YouTube Analytics for <span className="font-bold text-gray-600">"{youtubeUrl}"</span>
      </h2>

      {/* Render the Overall Summary */}
      {renderOverallSummary()}

      <div className="comment-section mb-8">
        {/* Render Positive Comments with Green Color Scheme */}
        {renderSection("Positive Comments", "bg-green-50", "border-green-500", "text-green-600")}

        <hr className="my-6 border-t border-gray-300" />

        {/* Render Negative Comments with Red Color Scheme */}
        {renderSection("Negative Comments", "bg-red-50", "border-red-500", "text-red-600")}

        <hr className="my-6 border-t border-gray-300" />

        {/* Render Neutral Comments with Yellow Color Scheme */}
        {renderSection("Neutral Comments", "bg-yellow-50", "border-yellow-500", "text-yellow-600")}
      </div>
    </div>
  );
};

export default YouTubeData;
