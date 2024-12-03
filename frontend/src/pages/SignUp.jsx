import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AuthToggle from '../components/AuthToggle';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import AnimatedGradientBackground from '../components/AnimatedGradientBackground';

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // Initialize the navigate function

    // Handle Google login success
    const handleGoogleSuccess = async (response) => {
        console.log("Google login successful:", response);

        // Decode the JWT token to get user information
        const { credential } = response;
        const userData = JSON.parse(atob(credential.split('.')[1])); // Decode the JWT to get user info

        const username = userData.name; // Get the user's name
        const email = userData.email; // Get the user's email

        // Prepare the data to send to the backend for Google sign-up
        const userSignupData = { username, email };

        try {
            // Send data to your backend for Google sign-up
            const signupResponse = await fetch('http://localhost:5000/api/auth/google-signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userSignupData),
            });

            const data = await signupResponse.json();

            if (signupResponse.ok) {
                console.log('Google signup successful:', data);
                alert('Signup successful! Redirecting to the home...');
                navigate('/signin'); // Redirect after successful signup
            } else {
                console.error('Google signup failed:', data.message);
                alert(`Signup failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error during Google signup:', error);
            alert(`Signup failed: ${error}`);
        }
    };

    // Handle Google login failure
    const handleGoogleFailure = (error) => {
        console.error("Google login failed:", error);
        // Optionally show a user-friendly error message here
    };

    // Handle form submission (username/email/password sign-up)
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        // const form = event.target;
        const form = event.currentTarget;
        const username = form.username.value;
        const email = form.email.value;
        const password = form.password.value;

        // Prepare the data to send to the backend
        const userData = { username, email, password };

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Signup successful:', data);
                //alert('Signup successful! Redirecting to the signin page...');
                navigate('/signin'); 
            } else {
                console.error('Signup failed:', data.message);
                alert(`Signup failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert(`Signup failed: ${error}`);
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
                        className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-2xl w-full max-w-md relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-center mb-6 text-white">
                                Sign Up Now!
                            </h2>
                            <AuthToggle />
                            <form className="space-y-6" onSubmit={handleFormSubmit}>
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-white">
                                        User Name
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        className="mt-1 block w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-white placeholder-white/50"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-white">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="mt-1 block w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-white placeholder-white/50"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-white">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            className="mt-1 block w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-white placeholder-white/50"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                    >
                                        Sign Up
                                    </motion.button>
                                </div>
                            </form>

                            {/* Google Login Button */}
                            <div className="mt-6">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleFailure}
                                    useOneTap
                                    theme="filled_black"
                                    text="signin_with"
                                    shape="rectangular"
                                    size="large"
                                />
                            </div>

                            <div className="mt-6">
                                <p className="text-center text-sm text-white/80">
                                    By signing up, you agree to our{' '}
                                    <a href="/terms" className="font-medium text-white hover:text-pink-200">
                                        Terms and Privacy Policy
                                    </a>.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </AnimatedGradientBackground>
        </GoogleOAuthProvider>
    );
};

export default SignUp;