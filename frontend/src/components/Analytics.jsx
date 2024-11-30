import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import Map from './Map'; // Ensure the Map component is imported once

// Register the required chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Analytics = ({ keyword, searchData }) => {
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchData && searchData.trends) {
      setTrendsData(searchData.trends);
    }
  }, [searchData]);
  // console.log(trendsData);

  // Fetching trends data from the API
  // const fetchTrendsData = async () => {
    // if (!keyword.trim()) {
    //   setError("Please enter a search keyword.");
    //   return;
    // }

    // setLoading(true); // Show loading spinner when the search is triggered
    // setError(null); // Reset previous errors
    // try {
    //   // const response = await fetch(`/fetch_data?keyword=${keyword}`);
    //   const response = await fetch(`http://localhost:8000/google/fetch_data?keyword=${encodeURIComponent(keyword)}`);;

    //   if (!response.ok) {
    //     throw new Error(`Failed to fetch trends data. Status: ${response.status}`);
    //   }
    //   const data = await response.json();
    //   setTrendsData(data.trends); // Assuming the response contains a "trends" object
    // } catch (err) {
    //   setError(err.message || "Failed to load trends data.");
    // } finally {
    //   setLoading(false); // Hide the loading spinner
    // }
  // };

  // Prepare data for chart.js
  const chartData = trendsData
    ? {
        labels: trendsData.interest_over_time.timeline_data.map((entry) => entry.date),
        datasets: [
          {
            label: "Interest Over Time",
            data: trendsData.interest_over_time.timeline_data.map((entry) => {
              const value = entry.values[0]?.value; // Get the interest value for the current search term
              return value ? parseInt(value) : 0;
            }),
            borderColor: "#1D4ED8", // Darker blue color
            backgroundColor: "rgba(29, 78, 216, 0.2)", // Light blue background
            tension: 0.4,
            fill: true,
          },
        ],
      }
    : {};

  // useEffect(() => {
  //   if (keyword) {
  //     fetchTrendsData(); // Fetch the trends data whenever the keyword changes
  //   }
  // }, [keyword]);

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen p-8 font-inter">
      <div className="max-w-7xl mx-auto grid grid-cols-2 gap-8">
        {/* Left side (Chart Section) */}
        <div className="col-span-1">
          {/* Error message for trends data */}
          {error && <div className="mb-4 text-red-600 font-semibold text-center">{error}</div>}

          {/* Loading spinner */}
          {loading && (
            <div className="flex justify-center items-center text-xl text-gray-600">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
            </div>
          )}

          {/* Trends Data */}
          {!loading && !error && trendsData && (
            <div className="bg-white p-6 rounded-lg shadow-xl">
              {/* Chart Title */}
              <div className="text-2xl font-medium mb-4 text-gray-800">
                Interest Over Time for <span className="text-blue-600">"{keyword}"</span>
              </div>

              {/* Chart */}
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: false, // Disable chart title to use our custom title
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const value = context.raw;
                          return `Interest Value: ${value}`;
                        },
                      },
                    },
                  },
                  scales: {
                    x: {
                      type: 'category',
                      title: {
                        display: true,
                        text: "Date Range",
                      },
                    },
                    y: {
                      type: 'linear',
                      title: {
                        display: true,
                        text: "Interest Value",
                      },
                      beginAtZero: true,
                    },
                  },
                }}
              />

              {/* Data Source Footer */}
              <div className="mt-4 text-sm text-gray-500 text-center border-t pt-4">
                Data Source: <span className="font-semibold text-blue-600">Google Trends</span>
              </div>
            </div>
          )}
        </div>

        {/* Right side (Map Section) */}
        <div className="col-span-1">
          <Map keyword={keyword} searchData={searchData} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
