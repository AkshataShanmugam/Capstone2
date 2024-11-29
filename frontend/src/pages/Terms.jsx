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
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                Movie Perception Analysis
              </h1>
            </div>
          </header>
          
          <div className="bg-white bg-opacity-90 shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Terms and Conditions</h2>
              <div className="space-y-6 text-gray-700">
                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-indigo-600">1. Acceptance of Terms</h3>
                  <p>By using our service, you agree to abide by these Terms and Conditions. If you disagree, please do not use the service.</p>
                </section>

                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-indigo-600">2. Changes to Terms</h3>
                  <p>We may update these Terms from time to time. Please review them periodically. Continued use of the service means you accept any changes.</p>
                </section>

                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-indigo-600">3. User Responsibilities</h3>
                  <p>You agree to use the service responsibly and legally. Any misuse or violation of these terms may result in suspension or termination of access.</p>
                </section>

                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-indigo-600">4. Privacy</h3>
                  <p>We value your privacy. Our Privacy Policy explains how your data is collected and used. By using our service, you consent to our data practices.</p>
                </section>

                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-indigo-600">5. Disclaimer</h3>
                  <p>The service is provided "as-is." We do not guarantee the accuracy of the analysis and are not liable for any errors or omissions.</p>
                </section>

                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-indigo-600">6. Limitation of Liability</h3>
                  <p>We are not responsible for any damages or losses resulting from the use of the service, to the fullest extent permitted by law.</p>
                </section>

                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-indigo-600">7. Governing Law</h3>
                  <p>These Terms are governed by the laws of the jurisdiction in which we operate. Any disputes will be resolved in the applicable courts of that jurisdiction.</p>
                </section>

                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-indigo-600">8. Contact</h3>
                  <p>If you have any questions about these Terms, please contact us at support@movieperception.com.</p>
                </section>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-100 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                By using our service, you acknowledge that you have read and understood these Terms and Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedGradientBackground>
  );
};

export default Terms;