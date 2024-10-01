import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const AllStudentsReports = () => {
  const [allLogicalErrors, setAllLogicalErrors] = useState([]);
  const [groupedErrors, setGroupedErrors] = useState({});
  const [overallErrorTypeCount, setOverallErrorTypeCount] = useState({});

  useEffect(() => {
    const fetchAllLogicalErrors = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/saveLogicalErrors/getAllLogicalErrors');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        const errors = result.logicalErrors;

        // Group errors by student (username)
        const groupedByStudent = errors.reduce((acc, record) => {
          const { username, logicalErrors } = record;
          if (!acc[username]) {
            acc[username] = [];
          }
          acc[username] = acc[username].concat(logicalErrors);
          return acc;
        }, {});

        setGroupedErrors(groupedByStudent);

        // Calculate overall error type count
        const allErrors = errors.flatMap(record => record.logicalErrors);
        setAllLogicalErrors(allErrors);

        const typeCount = allErrors.reduce((acc, error) => {
          acc[error.category] = (acc[error.category] || 0) + 1;
          return acc;
        }, {});
        setOverallErrorTypeCount(typeCount);
      } catch (error) {
        console.error('Error fetching all logical errors:', error);
      }
    };

    fetchAllLogicalErrors();
  }, []);

  // Prepare data for Pie Chart (Overall Error Distribution)
  const pieChartData = {
    labels: Object.keys(overallErrorTypeCount),
    datasets: [
      {
        label: 'Overall Logical Errors by Type',
        data: Object.values(overallErrorTypeCount),
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
      <h2>All Students Logical Errors Report</h2>

      {/* Overall Reports Section */}
      <section>
        <h3>Overall Logical Error Distribution</h3>
        {allLogicalErrors.length === 0 ? (
          <p>No logical errors found across all students.</p>
        ) : (
          <div style={{ maxWidth: '400px', margin: '0 auto', marginTop: '20px' }}>
            <Pie data={pieChartData} />
          </div>
        )}
      </section>

      {/* Individual Student Reports Section */}
      <section style={{ marginTop: '40px' }}>
        <h3>Individual Student Reports</h3>
        {Object.keys(groupedErrors).length === 0 ? (
          <p>No individual student reports available.</p>
        ) : (
          <div>
            {Object.entries(groupedErrors).map(([username, errors], index) => {
              const studentErrorCount = errors.reduce((acc, error) => {
                acc[error.category] = (acc[error.category] || 0) + 1;
                return acc;
              }, {});

              const studentPieData = {
                labels: Object.keys(studentErrorCount),
                datasets: [
                  {
                    label: `Logical Errors for ${username}`,
                    data: Object.values(studentErrorCount),
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
                <div key={index} style={{ marginBottom: '40px' }}>
                  <h4>Student: {username}</h4>
                  <ul>
                    {errors.map((error, idx) => (
                      <li key={idx}>
                        <strong>Type:</strong> {error.type} | <strong>Category:</strong> {error.category} | <strong>Line:</strong> {error.line} | <strong>Message:</strong> {error.message}
                      </li>
                    ))}
                  </ul>
                  <div style={{ maxWidth: '400px', margin: '0 auto', marginTop: '20px' }}>
                    <Pie data={studentPieData} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default AllStudentsReports;
