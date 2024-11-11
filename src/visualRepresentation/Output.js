import { Box, Button, Icon, Text, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { executeCode } from "../api";
import axios from "axios";
import {
  ViewIcon
} from "@chakra-ui/icons";

function Output({ editorRef, language }) {
  const toast = useToast();
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // To store specific error message

  const runCode = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));

      if (result.stderr) {
        // Extracting the part of the message after "error:"
        const specificErrorLine = result.stderr.split("\n").find(line => line.includes("error"));
        if (specificErrorLine) {
          const specificError = specificErrorLine.split("error:")[1].trim(); 
          
          const response = await axios.post(`http://localhost:3000/hint/ai/error-type`, {
            errorName: specificError,
          });
          
          if (response.data.hints && response.data.hints.length > 0) {
            setErrorMessage(response.data.hints[0].hintText); // Set the specific error message from hints
          } else {
            setErrorMessage("No hints available."); // Fallback message if no hints are returned
          }
        }
        setIsError(true);
      } else {
        setIsError(false);
        setErrorMessage(""); // Clear the error message if no error
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred.",
        description: error.message || "Unable to run code",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box w="50%">
      <Text mb={2} fontSize="lg">
        Output
      </Text>
      <Button
        variant="outline"
        colorScheme="green"
        mb={4}
        isLoading={isLoading}
        onClick={runCode}
      >
        Run Code
      </Button>

      {/* Output Box */}
      <Box
        height={isError ? "35.5vh" : "75vh"}
        p={2}
        color={isError ? "red.400" : ""}
        border="1px solid"
        borderRadius={4}
        borderColor={isError ? "red.500" : "#333"}
        mb={isError ? 4 : 0} // Add margin if there's an error message box
      >
        {output
          ? output.map((line, i) => <Text key={i}>{line}</Text>)
          : 'Click "Run Code" to see the output here'}
      </Box>

      {/* Display the specific error message only if there's an error */}
      {isError && errorMessage && (
        <Box color="yellow.800" height = "37.5vh" border="1px solid brown" borderRadius={4} p={2}>
          <Text fontWeight="bold" display="flex" alignItems="center">
            Hints <Icon as={ViewIcon} ml={2} /> {/* Added ViewIcon next to Hints */}
          </Text>
          <Text>{errorMessage}</Text>
        </Box>
      )}
    </Box>
  );
}

export default Output;
