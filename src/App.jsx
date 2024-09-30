import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login'; // Make sure you have this component
import CodeEditorContainer from './components/CodeEditorContainer';
import Signup from './components/Signup'; // Import Signup component

function App() {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');

  const handleLoginSuccess = (data) => {
    console.log('User Data:', data);
    const { token, user } = data; // Destructure the data to get token and user
    if (user) {
      setUsername(user.username); // Set username from user object
      setUserId(user._id); // Set userId from user object
      setToken(token); // Set the token
      console.log('Updated Username:', user.username); // Log the updated username
    } else {
      console.error('User data is missing'); // Handle case when user data is not available
    }
  };
  

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login setToken={handleLoginSuccess} setUsername={setUsername} setUserId={setUserId}/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/code-editor" element={<CodeEditorContainer username={username} userId={userId} />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
