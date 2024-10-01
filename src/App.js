import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Exam from './components/Exam'
import CreateExam from './components/createExam'
import CreateQuestion from './components/createQuestion'
import Questions from './components/Questions'
import Test from './components/Test'
import TestQuestions from './components/TestQuestions';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/exams' element={<Exam />}></Route>
          <Route path='/createExam' element={<CreateExam />}></Route>
          <Route path='/createQuestion/:id' element={<CreateQuestion />}></Route>
          <Route path='/question/:id' element={<Questions />}></Route>
          <Route path='/test' element={<Test />}></Route>
          <Route path='/testQuestions/:id' element={<TestQuestions />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}



export default App;
