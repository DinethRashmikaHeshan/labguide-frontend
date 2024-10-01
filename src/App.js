import './App.css';
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

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          //Home
          <Route path='/' element={<Home />}></Route>
          
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
