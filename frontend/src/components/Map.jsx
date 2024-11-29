import React, { useEffect, useState } from "react";
import { VectorMap } from "react-jvectormap";

const Map = ({ keyword, searchData }) => {
  const [mapData, setMapData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!keyword.trim()) {
        setError("Please enter a search keyword.");
        setLoading(false);
        return;
      }

      setLoading(true); // Show loading spinner when the search is triggered
      setError(null); // Reset previous errors
      try {
        const response = await fetch(`/results.json`);
        // const response = await fetch(`/fetch_data?keyword=${keyword}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch trends data. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data.trends.interest_by_region);

        // Process the data to create the mapData object
        const mappedData = data.trends.interest_by_region.reduce((acc, item) => {
          acc[item.geo] = parseInt(item.extracted_value, 10);
          return acc;
        }, {});

        setMapData(mappedData); // Set the map data
        setLoading(false); // Set loading to false once the data is fetched
      } catch (error) {
        setError(error.message); // Handle errors
        setLoading(false);
      }
    };

    fetchData();
  }, [keyword]); // Dependency array now includes keyword

  // Handle country click event
  const handleClick = (e, countryCode) => {
    console.log(countryCode);
  };

  if (loading) {
    return <div>Loading map data...</div>;
  }

  if (error) {
    return <div>Error loading map data: {error}</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>
        Interest by Region: {keyword}
      </h2>
      <div style={{ marginTop: "30px" }}>
        <VectorMap
          map={"world_mill"} // specify the world map
          backgroundColor="transparent" // Set background color
          zoomOnScroll={false} // Disable zoom on scroll
          containerStyle={{
            width: "100%", // Set map width to 100% of parent container
            height: "520px", // Set a fixed height for the map
            border: "1px solid #ccc", // Add a subtle border for the map
            borderRadius: "8px" // Rounded corners
          }}
          onRegionClick={handleClick} // Log country code on click
          containerClassName="map" // Custom class for the container
          regionStyle={{
            initial: {
              fill: "#e4e4e4", // Default color for countries
              "fill-opacity": 0.9,
              stroke: "none",
              "stroke-width": 0,
              "stroke-opacity": 0
            },
            hover: {
              "fill-opacity": 0.8, // Hover effect opacity
              cursor: "pointer" // Pointer cursor on hover
            },
            selected: {
              fill: "#2938bc" // Color for selected (clicked) country
            },
            selectedHover: {} // No change on hover of selected region
          }}
          regionsSelectable={true} // Allow region selection
          series={{
            regions: [
              {
                values: mapData, // Data used to color the regions
                scale: ["#146804", "#ff0000"], // Color range (green to red)
                normalizeFunction: "polynomial" // Normalize data for better color range representation
              }
            ]
          }}
        />
      </div>

      {/* Custom Legend */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <div style={{ display: "inline-block", width: "80%", textAlign: "left" }}>
          <div style={{ fontSize: "14px", color: "#333", marginBottom: "5px" }}>
            <strong>Interest Intensity:</strong> Low to High
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div
              style={{
                width: "50px",
                height: "20px",
                background: "#146804",
                margin: "0 5px",
                borderRadius: "5px"
              }}
            ></div>
            <div
              style={{
                width: "50px",
                height: "20px",
                background: "#ff0000",
                margin: "0 5px",
                borderRadius: "5px"
              }}
            ></div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <span style={{ marginRight: "5px", fontSize: "12px", color: "#666" }}>Low</span>
            <span style={{ marginLeft: "5px", fontSize: "12px", color: "#666" }}>High</span>
          </div>
        </div>
      </div>

      <p style={{ textAlign: "center", color: "#666", maxWidth: "800px", margin: "0 auto" }}>
        This map visualizes the regional interest for <strong>{keyword}</strong>.
        The color scale represents the intensity of interest, with regions shaded from green (lower interest) to red (higher interest).
        Click on any country to see more details.
      </p>
    </div>
  );
};

export default Map;
