import logo from './logo.svg';
import './App.css';
import HintManager from './HintingManagement/HintManager';


function App() {
  return (
    <div className="App">
      <div className="container">
      <h1 className="text-center my-5">Hint Manager</h1>
      <hr />
      <HintManager />
    </div>
    </div>
  );
}

export default App;
