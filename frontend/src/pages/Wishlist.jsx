import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the wishlist from the server when the component mounts
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('token'); // Ensure JWT token is stored in localStorage
        const response = await axios.get('http://127.0.0.1:5000/api/wishlist', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Log the response to inspect the structure
        console.log('Wishlist response:', response.data);

        // Check if the response structure is correct
        if (response.data && response.data.wishlist) {
          setWishlistItems(response.data.wishlist);
        } else {
          setError('No items found in your wishlist.');
          setWishlistItems([]); // Set empty array if no data
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        setError('Error fetching wishlist');
      } finally {
        setLoading(false); // Set loading to false after request is done
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (link) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://127.0.0.1:5000/api/wishlist/remove', 
        { link }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // After removing, update the wishlist state
      setWishlistItems((prevItems) => prevItems.filter(item => item.link !== link));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white p-6">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800">My Wishlist</h1>
          <Link
            to="/"
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to News
          </Link>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-indigo-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">Loading your wishlist...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-indigo-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">{error}</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-indigo-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">Your wishlist is empty.</p>
            <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">
              Discover some news to add
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistItems.map((article, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-indigo-100 relative"
              >
                <div onClick={() => window.open(article.link, "_blank")} className="cursor-pointer">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 hover:text-indigo-600 transition-colors">{article.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">Published on: {article.date}</p>
                  {article.thumbnail && (
                    <img src={article.thumbnail} alt="Article Thumbnail" className="w-full h-48 object-cover rounded-md mb-4" />
                  )}
                </div>
                <button
                  onClick={() => removeFromWishlist(article.link)}
                  className="Remove absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-red-50 transition-colors duration-300"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
