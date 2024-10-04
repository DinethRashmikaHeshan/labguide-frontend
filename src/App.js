import "./App.css";
import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./Home";

import Exam from "./ExamManagement/Exam";
import CreateExam from "./ExamManagement/createExam";
import CreateQuestion from "./ExamManagement/createQuestion";
import Questions from "./ExamManagement/Questions";
import Test from "./ExamManagement/Test";
import TestQuestions from "./ExamManagement/TestQuestions";
import Results from "./ExamManagement/Results";
import ResultTest from "./ExamManagement/ResultTest";

import Login from "./Login/Login"; // Make sure you have this component
import Signup from "./Login/Signup"; // Import Signup component

import CodeEditorContainer from "./components/CodeEditorContainer";

import LogicalErrorsReport from "./components/LogicalErrorsReport"; // Import the new report component
import LecturerDashboard from "./components/LecturerDashboard";
import AllStudentsReports from "./components/AllStudentsReports";
import SuggestionForm from "./components/SuggestionForm";
import ErrorLineGraph from "./components/ErrorLineGraph";
import AllErrorLineGraph from "./components/AllErrorLineGraph";
import CodeEditor from "./visualRepresentation/CodeEditor";
import CodeListPage from "./visualRepresentation/CodeListPage";

import HintManager from "./HintingManagement/HintManager";
import HintingManagement from "./HintingManagement/HinintingManagement";

function App() {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  const handleLoginSuccess = (data) => {
    console.log("User Data:", data);
    const { token, user } = data; // Destructure the data to get token and user
    if (user) {
      setUsername(user.username); // Set username from user object
      setUserId(user._id); // Set userId from user object
      setToken(token); // Set the token
      console.log("Updated Username:", user.username); // Log the updated username
    } else {
      console.error("User data is missing"); // Handle case when user data is not available
    }
  };
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          //Home
          <Route path="/home" element={<Home username={username} userId={userId}/>}></Route>
          <Route
            path="/"
            element={
              <Login
                setToken={handleLoginSuccess}
                setUsername={setUsername}
                setUserId={setUserId}
              />
            }
          />
          <Route path="/signup" element={<Signup />} />
          //exam management routes
          <Route path="/exams" element={<Exam />}></Route>
          <Route path="/createExam" element={<CreateExam />}></Route>
          <Route
            path="/createQuestion/:id"
            element={<CreateQuestion />}
          ></Route>
          <Route path="/question/:id" element={<Questions />}></Route>
          <Route path="/test" element={<Test />}></Route>
          <Route path="/testQuestions/:id" element={<TestQuestions />}></Route>
          <Route path="/results" element={<Results />}></Route>
          <Route path="/results/:id" element={<ResultTest />}></Route>
          //special function routes
          <Route
            path="/code-editor"
            element={
              <CodeEditorContainer username={username} userId={userId} />
            }
          />
          <Route
            path="/report"
            element={<LogicalErrorsReport username={username} />}
          />{" "}
          {/* New report route */}
          <Route path="/lecturer-dashboard" element={<LecturerDashboard />} />
          <Route
            path="/all-students-reports"
            element={<AllStudentsReports />}
          />
          <Route path="/suggestions" element={<SuggestionForm />} />
          <Route path="/errorLineGraph" element={<ErrorLineGraph />} />
          <Route path="/allEerrorLineGraph" element={<AllErrorLineGraph />} />
          <Route path="/codelist" element={<CodeListPage username={username} userId={userId} />} />
          <Route path="/code/new" element={<CodeEditor username={username} userId={userId} />}/>} />
          <Route path="/code/:id" element={<CodeEditor username={username} userId={userId} />}/>} />
          <Route path="/hint" element={<HintingManagement />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
