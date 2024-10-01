import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const LogicalErrorsReport = ({ username }) => {
  const [logicalErrors, setLogicalErrors] = useState([]);
  const [errorTypeCount, setErrorTypeCount] = useState({});

  useEffect(() => {
    const fetchLogicalErrors = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/saveLogicalErrors/getLogicalErrors?username=${username}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        // Flatten logical errors array from each fetched record
        const allLogicalErrors = result.logicalErrors.flatMap(record => record.logicalErrors);
        setLogicalErrors(allLogicalErrors);

        // Count the occurrences of each error type
        const typeCount = allLogicalErrors.reduce((acc, error) => {
          acc[error.category] = (acc[error.type] || 0) + 1;
          return acc;
        }, {});
        setErrorTypeCount(typeCount);
      } catch (error) {
        console.error('Error fetching logical errors:', error);
      }
    };

    fetchLogicalErrors();
  }, [username]);

  // Prepare data for Pie Chart
  const pieChartData = {
    labels: Object.keys(errorTypeCount),
    datasets: [
      {
        label: 'Logical Errors by Type',
        data: Object.values(errorTypeCount),
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

  return (
    <div>
      <h2>Logical Errors Report for {username}</h2>
      {logicalErrors.length === 0 ? (
        <p>No logical errors found.</p>
      ) : (
        <ul>
          {logicalErrors.map((error, index) => (
            <li key={index}>
              <strong>Type:</strong> {error.type} | <strong>Category:</strong> {error.category} | <strong>Line:</strong> {error.line} | <strong>Message:</strong> {error.message}
            </li>
          ))}
        </ul>
      )}

      {logicalErrors.length > 0 && (
        <div style={{ maxWidth: '400px', margin: '0 auto', marginTop: '40px' }}>
          <h3>Error Type Distribution</h3>
          <Pie data={pieChartData} />
        </div>
      )}
    </div>
  );
};

export default LogicalErrorsReport;
