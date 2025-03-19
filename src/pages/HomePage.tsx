// src/pages/HomePage.tsx
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                C2M
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-800 dark:text-white">
                
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {/* <a
                href="#features"
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300"
              >
                How It Works
              </a> */}
              <Link
                to="/login"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg px-5 py-2.5 transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </div>
            <div className="md:hidden">
              {/* Mobile menu button would go here */}
              <button className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-10 lg:mb-0">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Connect Directly With{" "}
                <span className="text-primary-600 dark:text-primary-400">
                  Brands
                </span>{" "}
                You Trust
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Our platform enables confidential, direct communication between
                consumers and manufacturers, ensuring your feedback is heard and
                acknowledged.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row">
                <Link
                  to="/register"
                  className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                </Link>
                <a
                  href="#how-it-works"
                  className="mt-3 sm:mt-0 sm:ml-3 flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10 transition-colors duration-300"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="relative lg:h-auto">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl transform -rotate-6 -translate-y-2 translate-x-2 opacity-20"></div>
                <div className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        C2M
                      </div>
                      <span className="text-lg font-semibold text-gray-800 dark:text-white">
                        
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-4">
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-gray-800 dark:text-white">
                        I recently purchased your SmartHome Hub and have some
                        feedback about the setup process.
                      </p>
                      <div className="mt-2 text-right text-xs text-gray-500">
                        Sent by Consumer - 10:30 AM
                      </div>
                    </div>
                    <div className="bg-primary-100 dark:bg-primary-900/30 p-4 rounded-lg ml-8">
                      <p className="text-gray-800 dark:text-white">
                        Thank you for reaching out! We value your feedback.
                        Please tell us more about your experience.
                      </p>
                      <div className="mt-2 text-right text-xs text-gray-500">
                        SmartHome Inc. - 10:35 AM
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-gray-800 dark:text-white">
                        The instructions were unclear in step 3. I think adding
                        a diagram would help future customers.
                      </p>
                      <div className="mt-2 text-right text-xs text-gray-500">
                        Sent by Consumer - 10:40 AM
                      </div>
                    </div>
                    <div className="bg-primary-100 dark:bg-primary-900/30 p-4 rounded-lg ml-8">
                      <p className="text-gray-800 dark:text-white">
                        That's excellent feedback! We'll update our
                        documentation with a diagram right away.
                      </p>
                      <div className="mt-2 text-right text-xs text-gray-500">
                        SmartHome Inc. - 10:45 AM
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg px-4 py-2 text-gray-700 dark:text-gray-300 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-r-lg hover:bg-primary-700 transition-colors duration-300">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Key Features
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 lg:mx-auto">
              Our platform offers unique ways to connect consumers and
              manufacturers
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-md flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Private Feedback
              </h3>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Share your thoughts directly with brands without public
                exposure. Your feedback remains confidential between you and the
                manufacturer.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-md flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Real-time Chat
              </h3>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Engage in meaningful conversations with brand representatives
                through our secure chat interface. Get real-time responses to
                your concerns.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-md flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Multi-brand Support
              </h3>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Interact with multiple brands through a single platform. No need
                to navigate different websites or feedback systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 lg:mx-auto">
              Start connecting with brands in just a few simple steps
            </p>
          </div>

          <div className="mt-16">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              {/* Step 1 */}
              <div className="relative p-5">
                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary-500 text-white mb-4 lg:mb-8 text-xl font-bold">
                  1
                </div>
                <div className="hidden lg:block absolute top-16 w-full">
                  <div className="h-1 bg-primary-500 w-full"></div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Create an Account
                </h3>
                <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                  Register as a consumer or manufacturer. Setup takes less than
                  2 minutes with a simple verification process.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative p-5 mt-10 lg:mt-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary-500 text-white mb-4 lg:mb-8 text-xl font-bold">
                  2
                </div>
                <div className="hidden lg:block absolute top-16 w-full">
                  <div className="h-1 bg-primary-500 w-full"></div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Submit Feedback
                </h3>
                <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                  Choose a manufacturer and share your thoughts, suggestions, or
                  concerns through our private channel.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative p-5 mt-10 lg:mt-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary-500 text-white mb-4 lg:mb-8 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Get Manufacturer Response
                </h3>
                <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                  Receive acknowledgment and engage in direct conversation with
                  brand representatives about your feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              What People Are Saying
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 lg:mx-auto">
              Hear from our users about their experience
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 shadow">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg">
                    JS
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                    Jane Smith
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Consumer
                  </p>
                </div>
              </div>
              <blockquote>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "I was able to communicate directly with the manufacturer
                  about a design flaw. They responded quickly and even
                  implemented my suggestion in their next product update!"
                </p>
              </blockquote>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 shadow">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg">
                    TD
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                    Tom Davis
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Product Manager at TechCorp
                  </p>
                </div>
              </div>
              <blockquote>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "As a manufacturer, this platform has revolutionized how we
                  collect and respond to customer feedback. It's helped us
                  improve our products significantly."
                </p>
              </blockquote>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 shadow">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg">
                    AL
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                    Alex Lee
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Consumer
                  </p>
                </div>
              </div>
              <blockquote>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "I appreciate the privacy this platform offers. I can share
                  honest feedback without worrying about my comments being
                  public or affecting my relationship with the brand."
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 bg-primary-600">
        <div className="absolute inset-0 opacity-10 bg-pattern-grid"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-primary-100 lg:mx-auto">
              Join thousands of consumers and manufacturers already using our
              platform.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                to="/register"
                className="bg-white text-primary-600 hover:bg-primary-50 font-medium rounded-lg px-8 py-3 shadow-md hover:shadow-xl transition-all duration-300 text-center"
              >
                Create an Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  C2M
                </div>
                <span className="ml-3 text-xl font-bold"></span>
              </div>
              <p className="mt-4 text-gray-300">
                Bridging the gap between consumers and manufacturers through
                private, direct communication.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 C2M. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
