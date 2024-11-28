import React from 'react';
import AnimatedGradientBackground from '../components/AnimatedGradientBackground';
import { FaFilm } from 'react-icons/fa';

const Terms = () => {
  return (
    <AnimatedGradientBackground>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <header className="bg-white bg-opacity-90 shadow-lg rounded-t-lg p-6 mb-6">
            <div className="flex items-center justify-center">
              <FaFilm className="text-4xl text-indigo-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Movie Prediction</h1>
            </div>
          </header>
          
          <div className="bg-white bg-opacity-90 shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Terms of Service</h2>
              <div className="space-y-6 text-gray-700">
                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-indigo-600">1. Acceptance of Terms</h3>
                  <p>By using our Movie Prediction service, you agree to these Terms of Service.</p>
                </section>
                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-indigo-600">2. Use of the Service</h3>
                  <p>You agree to use our service for personal, non-commercial purposes only.</p>
                </section>
                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-indigo-600">3. Privacy</h3>
                  <p>Your use of the service is also governed by our Privacy Policy.</p>
                </section>
                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-indigo-600">4. Disclaimer</h3>
                  <p>Predictions are for entertainment purposes only and not guaranteed to be accurate.</p>
                </section>
                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-indigo-600">5. Changes to Terms</h3>
                  <p>We reserve the right to modify these terms at any time. Please review regularly.</p>
                </section>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-100 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                By using our service, you acknowledge that you have read and understood these terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedGradientBackground>
  );
};

export default Terms;

