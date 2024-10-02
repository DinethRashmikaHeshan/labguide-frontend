import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './LogicalErrorsReport.css'; // Include the CSS file for styling

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const LogicalErrorsReport = ({ username }) => {
  const [logicalErrors, setLogicalErrors] = useState([]);
  const [groupedErrors, setGroupedErrors] = useState({});
  const [fromDate, setFromDate] = useState('');

  useEffect(() => {
    const fetchLogicalErrors = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/saveLogicalErrors/getLogicalErrors?username=${username}&fromDate=${fromDate}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        // Flatten logical errors array from each fetched record
        const allLogicalErrors = result.logicalErrors.flatMap(record => record.logicalErrors);
        setLogicalErrors(allLogicalErrors);

        // Group errors by type and then count occurrences of categories within each type
        const groupedByType = allLogicalErrors.reduce((acc, error) => {
          if (!acc[error.type]) {
            acc[error.type] = {};
          }
          acc[error.type][error.category] = (acc[error.type][error.category] || 0) + 1;
          return acc;
        }, {});

        setGroupedErrors(groupedByType);
      } catch (error) {
        console.error('Error fetching logical errors:', error);
      }
    };

    fetchLogicalErrors();
  }, [username, fromDate]); // Add fromDate as a dependency

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

      {logicalErrors.length === 0 ? (
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
      )}
    </div>
  );
};

export default LogicalErrorsReport;
