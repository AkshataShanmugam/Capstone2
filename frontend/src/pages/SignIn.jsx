import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AuthToggle from '../components/AuthToggle';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import AnimatedGradientBackground from '../components/AnimatedGradientBackground';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Check if the user is authenticated when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleGoogleSuccess = (response) => {
    console.log("Google login successful:", response);
    localStorage.setItem('authToken', response.credential); // Save the token in localStorage
    setIsAuthenticated(true);
  };

  const handleGoogleFailure = (error) => {
    console.error("Google login failed:", error);
    setIsAuthenticated(false);
  };

  // const handleGoogleLogout = () => {
  //   const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  //   window.google.accounts.id.disableAutoSelect();
  //   window.google.accounts.id.revoke(googleClientId)  // Pass the clientId here
  //     .then(() => {
  //       console.log("Google logout successful");
  //       localStorage.removeItem('authToken'); // Remove the token from localStorage
  //       setIsAuthenticated(false);
  //       setEmail(''); // Reset email state
  //       setPassword(''); // Reset password state
  //       navigate('/signin'); // Redirect to SignIn page
  //     })
  //     .catch((error) => {
  //       console.error("Google logout failed:", error);
  //     });
  // };

  // Local logout
  const handleLocalLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setEmail(''); // Reset email state
    setPassword(''); // Reset password state
    navigate('/signin'); // Redirect to SignIn page
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const credentials = { email, password };

    try {
      const response = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
        // Store the token in localStorage
        localStorage.setItem('authToken', data.token);
        setIsAuthenticated(true);
        alert('Signin success');

        setTimeout(() => {
          navigate('/'); // to home page
        }, 300);
      } else {
        console.error(data.message);
        alert(`Signin failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert(`Signin failed: ${error}`);
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AnimatedGradientBackground>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-opacity-10 bg-indigo-600 dark:bg-opacity-20 dark:bg-indigo-400 z-0">
              <div className="absolute inset-0 bg-[url('/movie-reel.svg')] opacity-5 bg-repeat"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600 dark:text-indigo-400">
                {isAuthenticated ? "Welcome Back!" : "Sign In"}
              </h2>
              <AuthToggle />
              <form className="space-y-6" onSubmit={handleSignIn}>
                {!isAuthenticated && (
                  <>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 dark:text-gray-300"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {!isAuthenticated && 
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                  >
                    Sign In
                  </button>
                </div>
              }
              </form>
              <div className="mt-4">
                {isAuthenticated ? (
                  <>
                    
                    <button
                      onClick={handleLocalLogout}
                      // className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 mt-4"
                      className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                  
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                    useOneTap
                    size="large"
                    theme="outline"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedGradientBackground>
    </GoogleOAuthProvider>
  );
};

export default SignIn;
