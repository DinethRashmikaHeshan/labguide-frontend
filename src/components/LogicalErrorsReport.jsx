import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ErrorLineGraph from './ErrorLineGraph'; // Import the ErrorLineGraph component
import './LogicalErrorsReport.css'; // Include the CSS file for styling
import { Link } from "react-router-dom";


// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const LogicalErrorsReport = ({ username }) => {
  const [logicalErrors, setLogicalErrors] = useState([]);
  const [groupedErrors, setGroupedErrors] = useState({});
  const [errorFrequency, setErrorFrequency] = useState({});
  const [suggestions, setSuggestions] = useState({});
  const [userSuggestions, setUserSuggestions] = useState({}); // For recommended links
  const [fromDate, setFromDate] = useState('');

  useEffect(() => {
    const fetchLogicalErrors = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/saveLogicalErrors/getLogicalErrors?username=${username}&fromDate=${fromDate}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        const allLogicalErrors = result.logicalErrors.flatMap(record => record.logicalErrors);
        setLogicalErrors(allLogicalErrors);

        const groupedByTypeAndCategory = allLogicalErrors.reduce((acc, error) => {
          if (!acc[error.type]) {
            acc[error.type] = {};
          }
          acc[error.type][error.category] = (acc[error.type][error.category] || 0) + 1;
          return acc;
        }, {});
        setGroupedErrors(groupedByTypeAndCategory);

        const frequencyCount = allLogicalErrors.reduce((acc, error) => {
          const key = `${error.type} - ${error.category}`;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});
        setErrorFrequency(frequencyCount);

        const fetchSuggestions = async () => {
          const fetchedSuggestions = {};
          const userSpecificSuggestions = {};
          for (const [key] of Object.entries(frequencyCount)) {
            const [errorType, category] = key.split(' - ');

            try {
              const response = await fetch(`http://localhost:3000/api/errorSuggestions/${errorType}/${category}`);
              if (response.ok) {
                const { supportiveLink } = await response.json();
                fetchedSuggestions[key] = supportiveLink;

                // For user-specific errors only
                userSpecificSuggestions[key] = supportiveLink;
              } else {
                fetchedSuggestions[key] = 'No link found';
              }
            } catch (error) {
              console.error('Error fetching suggestion:', error);
            }
          }
          setSuggestions(fetchedSuggestions);
          setUserSuggestions(userSpecificSuggestions); // Store user-specific suggestions
        };

        fetchSuggestions();
      } catch (error) {
        console.error('Error fetching logical errors:', error);
      }
    };

    fetchLogicalErrors();
  }, [username, fromDate]);

  // Generate pie chart data for each error type
  const generatePieChartData = (errorTypeData) => {
    return {
      labels: Object.keys(errorTypeData),
      datasets: [
        {
          label: 'Error Categories',
          data: Object.values(errorTypeData),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-gray-900 text-white shadow-lg transition duration-300">
        <h1 className="text-2xl font-extrabold">&lt;Lab Guide/&gt;</h1>
        <nav>
          <ul className="flex space-x-6">
            <Link to={"/home"}>
              <li>
                <a
                  href="#features"
                  className="hover:text-green-400 transition duration-200"
                >
                  Home
                </a>
              </li>
            </Link>

            <Link to={"/test"}>
              <li>
                <a
                  href="#features"
                  className="hover:text-green-400 transition duration-200"
                >
                  Exams
                </a>
              </li>
            </Link>
            <Link to={"/report"}>
              <li>
                <a
                  href="#features"
                  className="hover:text-green-400 transition duration-200"
                >
                  Report
                </a>
              </li>
            </Link>
            <Link to={"/code/:userId"}>
              <li>
                <a
                  href="#mycodes"
                  className="hover:text-green-400 transition duration-200"
                >
                  My Codes
                </a>
              </li>
            </Link>
          </ul>
        </nav>
      </header>
    <div className="logical-errors-report">
      <h1 className="title">Logical Errors Report for {username}</h1>
      
      <div className="filter-section">
        <label htmlFor="fromDate">From Date:</label>
        <input 
          type="datetime-local" 
          id="fromDate" 
          value={fromDate} 
          onChange={(e) => setFromDate(e.target.value)} 
        />
      </div>

      {logicalErrors.length > 0 && (
        <div className="charts-section">
          {Object.keys(groupedErrors).map((errorType, index) => (
            <div key={index} className="chart-container">
              <h3>{errorType} Type Distribution</h3>
              <Pie data={generatePieChartData(groupedErrors[errorType])} />
            </div>
          ))}
        </div>
      )}

      {/* {logicalErrors.length === 0 ? (
        <p className="no-errors-message">No logical errors found.</p>
      ) : (
        <div className="error-list">
          {logicalErrors.map((error, index) => (
            <div key={index} className="error-card">
              <p><strong>Type:</strong> {error.type}</p>
              <p><strong>Category:</strong> {error.category}</p>
              <p><strong>Line:</strong> {error.line}</p>
              <p><strong>Message:</strong> {error.message}</p>
            </div>
          ))}
        </div>
      )} */}

      {/* Pattern Recognition Section */}
      <section className="pattern-recognition-section">
        <h2>Pattern Recognition</h2>
        {Object.keys(errorFrequency).length > 0 ? (
          <div className="frequency-list">
            <h3>Error Type & Category Frequency </h3>
            <ul>
              {Object.entries(errorFrequency).map(([key, count], index) => (
                <li key={index}>
                  {key}: {count} occurrences
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No error frequency data available.</p>
        )}
      </section>

      {/* Recommended Links Section */}
      <section className="recommended-links-section">
        <h2>Recommended Links</h2>
        <div className="cards-container">
          {Object.keys(userSuggestions).length > 0 ? (
            Object.entries(userSuggestions).map(([key, link], index) => (
              <div className="suggestion-card" key={index}>
                <h3>{key}</h3>
                <p>
                  <strong>Link:</strong> 
                  <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                </p>
              </div>
            ))
          ) : (
            <p>No recommended links found for your errors.</p>
          )}
        </div>
      </section>

      {/* Display the ErrorLineGraph component with username and fromDate props */}
      <ErrorLineGraph username={username}  />
    </div>
    {/* Footer */}
    <footer className="bg-gray-900 text-white text-center p-4">
        <p>&copy; 2024 Programming Assistant. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a
            href="/privacy"
            className="text-gray-400 hover:underline transition duration-200"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-gray-400 hover:underline transition duration-200"
          >
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LogicalErrorsReport;
