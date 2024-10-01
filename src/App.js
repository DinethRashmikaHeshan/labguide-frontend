import { Box } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CodeEditor from "./components/CodeEditor";
import CodeListPage from "./components/CodeListPage";
import "./App.css";

function App() {
  return (
    <Box minH="100vh" bg="0f0a19" color="gray.500" px={6} py={8}>
      <Router>
        <Routes>
          <Route path="/" element={<CodeListPage />} />
          <Route path="/code/new" element={<CodeEditor />} />
          <Route path="/code/:id" element={<CodeEditor />} />
        </Routes>
      </Router>
    </Box>
  );
}

export default App;
