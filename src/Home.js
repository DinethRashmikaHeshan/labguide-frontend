import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CodeEditor from './components/CodeEditorContainer';


// Sample data for features and testimonials
const features = [
  { title: 'Code Hints', description: 'Get intelligent hints as you write code to improve your learning experience.' },
  { title: 'Code Editor Suggestions', description: 'Receive suggestions in a smart code editor to enhance your coding skills.' },
  { title: 'Online Exams', description: 'Take coding challenges and assessments online with real-time feedback.' },
  { title: 'Graphical Representation', description: 'Visualize algorithms and code execution with interactive graphs.' },
];

const testimonials = [
  { name: 'Alice', feedback: 'This tool transformed my coding practice and made learning so much easier!' },
  { name: 'Bob', feedback: 'The hints and suggestions are incredibly helpful. Highly recommend!' },
];

// Home component
function Home() {
  const [visible, setVisible] = useState(false);

  // Effect to trigger visibility on mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100); // Delay for effect
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-gray-900 text-white shadow-lg transition duration-300">
                <h1 className="text-2xl font-extrabold">Programming Assistant</h1>
                <nav>
                    <ul className="flex space-x-6">
                        <Link to={'./../'}><li><a href="#features" className="hover:text-green-400 transition duration-200">Home</a></li></Link>
                        <li><a href="#features" className="hover:text-green-400 transition duration-200">Features</a></li>
                        <Link to={'./test'}><li><a href="#features" className="hover:text-green-400 transition duration-200">Exams</a></li></Link>
                        <li><a href="#contact" className="hover:text-green-400 transition duration-200">Contact</a></li>
                    </ul>
                </nav>
            </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center p-12 relative overflow-hidden">
        <h2 className="text-4xl font-bold mb-4">Enhance Your Coding Experience</h2>
        <p className="mb-6">Get intelligent assistance at every step of your programming journey.</p>
        <button className="mt-4 px-8 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition duration-300 transform hover:scale-105 hover:shadow-lg">Start Coding</button>
      </section>

      {/* Features Overview */}
      <section id="features" className={`py-10 transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="text-3xl font-bold text-center mb-6">Features</h3>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {features.map((feature, index) => (
            <div key={index} className="p-6 border border-gray-300 rounded-lg shadow-lg bg-white transition-transform duration-300 hover:shadow-xl hover:scale-105">
              <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Demo */}
      <section className={`py-10 text-center transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="text-3xl font-bold mb-4">Try Our Interactive Demo</h3>
        <div className="max-w-3xl mx-auto border p-6 rounded-lg bg-gray-100 shadow-lg transition-shadow duration-300 hover:shadow-xl">
          
          <CodeEditor/>
        </div>
       
      </section>

      {/* Testimonials */}
      <section className={`py-10 bg-gray-50 transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="text-3xl font-bold text-center mb-6">What Users Say</h3>
        <div className="max-w-6xl mx-auto flex flex-col space-y-4 px-4">
          {testimonials.map((testimonial, index) => (
            <blockquote key={index} className="border-l-4 border-blue-500 italic bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-xl hover:bg-gray-100">
              <p className="mb-2 text-lg">"{testimonial.feedback}"</p>
              <cite className="block text-right text-gray-600">- {testimonial.name}</cite>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className={`py-10 transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="text-3xl font-bold text-center mb-6">Resources</h3>
        <div className="text-center">
          <a href="/tutorials" className="text-blue-600 hover:underline transition duration-200">View Tutorials</a> | 
          <a href="/blog" className="text-blue-600 hover:underline transition duration-200">Read Blog</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center p-4">
        <p>&copy; 2024 Programming Assistant. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="/privacy" className="text-gray-400 hover:underline transition duration-200">Privacy Policy</a>
          <a href="/terms" className="text-gray-400 hover:underline transition duration-200">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}

export default Home;
