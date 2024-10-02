import React from 'react';
import { Link } from 'react-router-dom';

const LecturerDashboard = () => {
  return (
    <div>
      <h1>Lecturer Dashboard</h1>
      <Link to="/all-students-reports">
        <button>View All Students' Logical Error Reports</button>
      </Link>
      <Link to="/suggestions">
        <button>Add Suggestions for Error Scenarios</button>
      </Link>
    </div>
  );
};

export default LecturerDashboard;
