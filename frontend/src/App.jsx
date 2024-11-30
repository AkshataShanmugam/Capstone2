// // import React, { useEffect, useState } from 'react';

// // export default function App() {
// //   const [movies, setMovies] = useState([]); // State to store the fetched data
// //   const [error, setError] = useState(null); // State to store errors, if any

// //   useEffect(() => {
// //     // Test fetching data from your server (GET request)
// //     const fetchMovies = async () => {
// //       try {
// //         const response = await fetch('http://localhost:5000/api/scripts'); // Replace with your backend API URL
// //         if (!response.ok) {
// //           throw new Error('Network response was not ok');
// //         }
// //         const data = await response.json();  // Parse the JSON data from the response
// //         setMovies(data);  // Set the fetched data to state
// //       } catch (error) {
// //         setError(error.message);  // Set error message to state if fetching fails
// //       }
// //     };

// //     // Fetch data when the component mounts
// //     fetchMovies();
// //   }, []); // Empty dependency array to only run this effect once on mount

// //   // Render UI based on the fetched data or any errors
// //   if (error) {
// //     return <div>Error: {error}</div>;
// //   }

// //   return (
// //     <div>
// //       <h1>Fetched Movies Data</h1>
// //       {movies.length === 0 ? (
// //         <p>Loading...</p>
// //       ) : (
// //         <ul>
// //           {movies.map((movie, index) => (
// //             <li key={index}>{movie.title}</li> // Display the movie title (adjust field name based on your API response)
// //           ))}
// //         </ul>
// //       )}
// //     </div>
// //   );
// // }


// // import { Routes, Route } from "react-router-dom";
// // import React from "react";
// // import Home from "./pages/Home";
// // import About from "./pages/About";
// // import Prediction from "./pages/Prediction";
// // import SignUp from "./pages/SignUp";
// // import SignIn from "./pages/SignIn";
// // import Header from "./components/Header";
// // import Footer from "./components/Footer";

// // export default function App() {
// //   return ( 
// //     <>
// //       <Header />
// //       <Routes>
// //         <Route path="/" element={<Home />} />
// //         <Route path="/prediction" element={<Prediction />} />
// //         <Route path="/signin" element={<SignIn />} />
// //         <Route path="/signup" element={<SignUp />} />
// //         <Route path="/about" element={<About />} />
// //       </Routes>
// //       <Footer />  
// //     </>
// //   );
// // }


import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route, no need for Router
import Sidebar from './components/Sidebar'; // Import Sidebar
import SearchPage from './pages/SearchPage'; // Import SearchPage component
import MovieGrid from './components/MovieGrid'; // Import MovieGrid
import News from './pages/News'; // Import the News page component
import Wishlist from './pages/Wishlist';
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Chat from './pages/Chat';
import Terms from "./pages/Terms";


const App = () => {
  // Check if dark mode setting exists in localStorage
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';

  // Initialize dark mode state based on saved preference or default to true
  const [darkMode, setDarkMode] = useState(savedDarkMode);

  const [sidebarExpanded, setSidebarExpanded] = useState(true); // Track sidebar state (expanded/collapsed)

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Apply the dark mode class to the body and save the preference to localStorage
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('darkMode', 'true'); // Save dark mode preference
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('darkMode', 'false'); // Save light mode preference
    }
  }, [darkMode]);

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-[#121212]' : 'bg-[#f5f5f5]'} transition-colors duration-300`}>
      {/* Sidebar */}
      <Sidebar sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded} />

      {/* Main caontent area */}
      <div
        className={`flex-1 flex flex-col overflow-y-auto transition-all duration-300 ease-in-out`}
        style={{
          marginLeft: '5vw', // Apply a 5vw margin to the content area from the left
        }}
      >
        <div className="flex flex-col p-6 flex-grow">
          <Routes>
            {/* Default home page route */}
            {/* <Route path="/" element={
              <div>
                <h2 className="text-3xl font-semibold text-white dark:text-gray-100 mb-4">Top Rated</h2>
                <MovieGrid category="top-rated" />
                <h2 className="text-3xl font-semibold text-white dark:text-gray-100 mt-8 mb-4">Best of Action</h2>
                <MovieGrid category="action" />
              </div>
            } /> */}

            {/* News page route */}
            <Route path="/" element={<News />} />
            <Route path="/SearchPage" element={<SearchPage />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;


