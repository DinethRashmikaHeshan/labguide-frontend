import './App.css';
import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from './Home';

import Exam from './ExamManagement/Exam'
import CreateExam from './ExamManagement/createExam'
import CreateQuestion from './ExamManagement/createQuestion'
import Questions from './ExamManagement/Questions'
import Test from './ExamManagement/Test'
import TestQuestions from './ExamManagement/TestQuestions';
import Results from './ExamManagement/Results';
import ResultTest from './ExamManagement/ResultTest';

import Login from './Login/Login'; // Make sure you have this component
import Signup from './Login/Signup'; // Import Signup component
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
    <div className="App">
      <BrowserRouter>
        <Routes>

          //Home
          <Route path='/home' element={<Home />}></Route>

          <Route path="/" element={<Login setToken={handleLoginSuccess} setUsername={setUsername} setUserId={setUserId}/>} />
          <Route path="/signup" element={<Signup />} />
          
          //exam management routes
          <Route path='/exams' element={<Exam />}></Route>
          <Route path='/createExam' element={<CreateExam />}></Route>
          <Route path='/createQuestion/:id' element={<CreateQuestion />}></Route>
          <Route path='/question/:id' element={<Questions />}></Route>
          <Route path='/test' element={<Test />}></Route>
          <Route path='/testQuestions/:id' element={<TestQuestions />}></Route>
          <Route path='/results' element={<Results />}></Route>
          <Route path='/results/:id' element={<ResultTest />}></Route>

          
        </Routes>
      </BrowserRouter>
    </div>
  );
}



export default App;
