import React, { useState, useRef } from 'react';
import CodeEditor from './CodeEditor';
import ErrorList from './ErrorList';
import LogicalErrorList from './LogicalErrorList';
import { useNavigate } from 'react-router-dom';


const files = {
  "script.c": {
    name: 'script.c',
    language: 'c',
    value: '#include <stdio.h>\nint main() {\n    printf("Hello, World!");\n    return 0;\n}'
  },
  "index.html": {
    name: 'index.html',
    language: 'html',
    value: '<div> </div>'
  }
};

const CodeEditorContainer = ({ username, userId }) => {
  const [fileName, setFileName] = useState("script.c");
  const [errors, setErrors] = useState([]);
  const [comparisonErrors, setComparisonErrors] = useState([]);
  console.log('Username in CodeEditorContainer:', username);
  console.log('User ID in CodeEditorContainer:', userId);

  const navigate = useNavigate();

  const navigateToReport = () => {
    navigate('/report'); // Navigate to the report page
  };



  const [logicalErrors, setLogicalErrors] = useState([]); 

  const editorRef = useRef(null);

  function handleEditorMount(editor) {
    editorRef.current = editor;
  }

  async function checkForErrors() {
    try {
      const code = editorRef.current.getValue();
      const response = await fetch('http://localhost:3000/api/checkErrors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setErrors(result.errors);
    } catch (error) {
      console.error('Error checking for errors:', error);
    }
  }

  async function compareWithReference() {
    try {
      const code = editorRef.current.getValue();
      const response = await fetch('http://localhost:3000/api/compareCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setComparisonErrors(result.comparisonErrors);
      setErrors(result.categorizedErrors); // Also update categorized errors here
    } catch (error) {
      console.error('Error comparing with reference code:', error);
    }
  }

  // Added function to check for logical errors using cppcheck
  async function checkLogicalErrors() {
    try {
      const code = editorRef.current.getValue();
      const response = await fetch('http://localhost:3000/api/checkLogicalErrors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setLogicalErrors(result.logicalErrors);

      // Save the logical errors to the database
    await saveLogicalErrors(result.logicalErrors);
    } catch (error) {
      console.error('Error checking logical errors:', error);
    }
  }

  // Function to save logical errors
async function saveLogicalErrors(logicalErrors) {
  try {
    const response = await fetch('http://localhost:3000/api/saveLogicalErrors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        userId,
        logicalErrors, // Pass the logical errors received from the backend
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Received logical errors:', result.logicalErrors);
    console.log(result.message); // Display success message or handle it
  } catch (error) {
    console.error('Error saving logical errors:', error);
  }
}
const buttonStyle = {
  margin: '10px',
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px'
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '20px'
};


  return (
    <div className='App'>
      
      <button style={buttonStyle} onClick={compareWithReference}>
          Compare with Reference
        </button>
        <button style={buttonStyle} onClick={checkLogicalErrors}>
          Check for Logical Errors
        </button>
        <button style={buttonStyle} onClick={navigateToReport}>
          Check My Report
        </button>
      <CodeEditor
        fileName={fileName}
        files={files}
        onEditorMount={handleEditorMount}
      />
      <ErrorList errors={errors} comparisonErrors={comparisonErrors} />
      <LogicalErrorList logicalErrors={logicalErrors} /> 

      {/* Display the username and userId at the bottom */}
      <div style={{ position: 'fixed', bottom: 0, width: '100%', textAlign: 'center', padding: '10px', background: '#f1f1f1' }}>
        <p>Logged in as: {username} (ID: {userId})</p>
      </div>
    </div>
  );
};

export default CodeEditorContainer;