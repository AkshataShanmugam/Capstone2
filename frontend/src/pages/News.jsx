import React, { useState, useEffect } from 'react';
import { Plus, Heart } from 'lucide-react';

const News = () => {
  const [data, setData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showSummarizedContent, setShowSummarizedContent] = useState(false);
  const [hasSummarized, setHasSummarized] = useState(false);
  const [summarizedData, setSummarizedData] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Load data from sessionStorage when the component mounts
    const storedData = sessionStorage.getItem('newsData');
    const storedKeyword = sessionStorage.getItem('keyword');
    const storedSummarizedData = sessionStorage.getItem('newsSummarized');

    if (storedData) {
      setData(JSON.parse(storedData));
    }
    if (storedKeyword) {
      setKeyword(JSON.parse(storedKeyword));
    }
    if (storedSummarizedData) {
      setSummarizedData(JSON.parse(storedSummarizedData));
    }
  }, []); 

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(storedWishlist);
  }, []);

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (keyword.trim() === "") {
      setError("Please enter a keyword.");
      return;
    }

    setLoading(true);
    setError(null);
    setHasSummarized(false); // Reset summarization status when a new search is done

    try {
      const response = await fetch(`/results.json`);
      // const response = await fetch(`http://localhost:8000/google/fetch_data?keyword=${encodeURIComponent(keyword)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const jsonData = await response.json();
      setData(jsonData);
      setOriginalData(jsonData);
      setSummarizedData(jsonData.summarized_news);
      sessionStorage.setItem('newsData', JSON.stringify(jsonData)); // Replace the old data with new results
      sessionStorage.setItem('newsSummarized', JSON.stringify(jsonData.summarized_news)); // Replace the old data with new results
      sessionStorage.setItem('keyword', JSON.stringify(keyword)); // Replace the old data with new results
    } catch (err) {
      setError(`Error loading data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = () => {
    if (!hasSummarized) {
      setIsSummarizing(true);
      setShowSummarizedContent(true);

      setTimeout(() => {
        setHasSummarized(true);
        setIsSummarizing(false);
      }, 3000);
    } else {
      setShowSummarizedContent(!showSummarizedContent);
    }
  };

  const renderFormattedContent = (summarizedData) => {
    const formatText = (text) => {
      const sections = text.split('**'); // Split by title markers (assumes '**' is the delimiter)
      const formattedSections = [];
      
      for (let i = 0; i < sections.length; i++) {
        if (i % 2 === 1) {
          const title = sections[i].trim();
          formattedSections.push(
            <h3 key={`title-${i}`} className="text-2xl font-bold mt-14 mb-4 p-2 border-b-2 border-gray-300">
              {title}
            </h3>
          );
        } else {
          const content = sections[i].trim();
          const points = content.split('\n').map((line, index) => {
            if (line.trim()) {
              return (
                <li key={`point-${i}-${index}`} className="list-inside mt-2">{line.trim()}</li>
              );
            }
            return null;
          });
          
          formattedSections.push(<ul key={`content-${i}`}>{points}</ul>);
        }
      }
      
      return formattedSections;
    };
    
    return (
      <section className="mt-6 ">
        <div>
          {formatText(summarizedData)}
        </div>
      </section>
    );
  };

  const toggleWishlist = async (article) => {
    const isInWishlist = wishlist.some(item => item.link === article.link);

    // Create the payload for adding/removing from wishlist
    const payload = {
      title: article.title,
      link: article.link,
      date: article.date,
      thumbnail: article.thumbnail
    };

    try {
      const url = isInWishlist
        ? 'http://127.0.0.1:5000/api/wishlist/remove'
        : 'http://127.0.0.1:5000/api/wishlist/add';

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isInWishlist ? { link: article.link } : payload)
      });

      if (response.ok) {
        const updatedWishlist = isInWishlist
          ? wishlist.filter(item => item.link !== article.link)
          : [...wishlist, article];

        setWishlist(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      } else {
        throw new Error('Failed to update wishlist.');
      }
    } catch (err) {
      setError(`Error updating wishlist: ${err.message}`);
    }
  };

  // Skeleton loader for individual cards
  const renderCardSkeleton = () => (
    <div className="bg-white p-4 rounded-lg shadow-md animate-pulse hover:shadow-lg transition cursor-pointer hover:text-indigo-600 hover:border-indigo-600 border-b border-gray-200 relative">
      <div className="w-full h-32 bg-gray-300 rounded-lg mb-4"></div>
      <div className="h-6 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded mb-4"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 bg-gradient-to-b from-indigo-100 to-white .p-6">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg flex">
        {/* Main Content */}
        <div className="w-3/4 pr-8">
          {/* Header Section */}
          <header className="mb-12">
            <h1 className="text-4xl font-semibold text-center text-gray-800 mb-4">
              News, Search & Trends Dashboard for <span className="text-indigo-600">{keyword || '--'}</span>
            </h1>
            <p className="text-lg text-center text-gray-600">Explore the latest news, search results, and trending topics for your keyword.</p>

            {/* Summarize Button (appears after search) */}
            {data && !isSummarizing && (
              <div className="text-center mt-6">
                <button
                  onClick={handleSummarize}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all ease-in-out duration-300"
                  id="summarizeButton" 
                  data-test="summarize-button"
                  disabled={isSummarizing} // Disable button when summarizing is in progress
                >
                  {showSummarizedContent ? "Back to Articles" : "Summarize"}
                </button>
              </div>
            )}

            {/* Hide Search Input and Button when Summarizing */}
            {!isSummarizing && !showSummarizedContent && (
              <div className="flex flex-col justify-center items-center h-full mt-8">
              <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto transition-all duration-500 ease-in-out">
                <input
                  type="text"
                  placeholder="Enter a keyword"
                  value={keyword} // This ensures that the input field reflects the state
                  onChange={handleKeywordChange}
                  name="movieNews"
                  id="movieNews"
                  className="p-3 border border-gray-300 rounded-lg w-full mb-4 text-lg"
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white p-3 rounded-lg"
                >
                  Search
                </button>
              </form>

              </div>
            )}
          </header>

          {/* Show Shimmer Effect for Summarize only if summarization has not been done */}
          {isSummarizing && !hasSummarized && (
            <section className="mt-12">
              <div className="animate-pulse">
                <p className="text-center text-xl text-gray-500">Summarizing...</p>
                <div className="bg-gray-300 h-4 w-3/4 mx-auto rounded mt-2 mb-6"></div>
                <div className="bg-gray-300 h-4 w-1/2 mx-auto rounded mt-2"></div>
              </div>
            </section>
          )}

          {/* Show Summarized Content */}
          {showSummarizedContent && !isSummarizing && summarizedData && (
            <section className="mt-12 summarized-content-class">
              <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Summarized Content</h2>

              <div className="bg-white p-4 rounded-lg shadow-md">
                {renderFormattedContent(summarizedData)}
              </div>
            </section>
          )}

          {/* Show Original Articles */}
          {!showSummarizedContent && !loading && !isSummarizing && data && (
            <section className="mt-12">
              <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Top News Articles</h2>
              {data.news.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.news.map((article, index) => (
                    <div 
                      key={index} 
                      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer hover:text-indigo-600 hover:border-indigo-600 border-b border-gray-200 relative" 
                    >
                      <div onClick={() => window.open(article.link, "_blank")}>
                        <h3 className="news-title text-xl font-medium text-gray-700 mb-2">{article.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">Published on: {article.date}</p>
                        {article.thumbnail && (
                          <img src={article.thumbnail} alt="Article Thumbnail" className="w-full h-32 object-cover rounded-lg mb-4" />
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(article);
                        }}
                        className="absolute bottom-2 right-2 p-1 rounded-full bg-white shadow-md hover:bg-gray-100"
                        aria-label={wishlist.some(item => item.link === article.link) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        {wishlist.some(item => item.link === article.link) ? (
                          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                        ) : (
                          <Plus className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No news articles available.</p>
              )}
            </section>
          )}

          {/* Show skeleton loader when loading */}
          {loading && !data && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => renderCardSkeleton(index))}
            </div>
          )}

          {/* Display Error Message */}
          {error && <p className="text-red-500 text-center mt-4" id="errorMessage" data-test="error-message">{error}</p>}
        </div>

        {/* Sidebar for Latest Articles */}
        {!showSummarizedContent && (
          <div className="w-1/4 bg-gray-50 p-6 rounded-lg shadow-lg sticky top-0">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Latest Articles</h3>
            {data && data.news.slice(0, 5).map((article, index) => (
              <div key={index} className="mb-4">
                <h4
                  onClick={() => window.open(article.link, "_blank")} 
                  className="text-lg font-medium text-gray-700 mb-2 cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  {article.title}
                </h4>
                <p className="text-sm text-gray-500 mb-1">Published on: {article.date}</p>
                <hr className="border-t border-gray-300 my-2" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
