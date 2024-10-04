import { Box, HStack, Button, Input, useToast } from "@chakra-ui/react";
import React, { useRef, useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

const CodeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (id && id !== "new") {
      const fetchCode = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/codes/${id}`
          );
          setValue(response.data.code);
          setTitle(response.data.title);
          setLanguage(response.data.language); // Ensure language is set
        } catch (error) {
          console.error("Error fetching code:", error);
          toast({
            title: "Error",
            description: "Failed to fetch code. Please try again later.",
            status: "error",
            duration: 6000,
          });
        }
      };

      fetchCode();
    }
  }, [id, toast]);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const saveCode = async () => {
    const code = editorRef.current?.getValue();
    if (!code || !title) {
      toast({
        title: "Validation Error",
        description: "Code and title are required.",
        status: "error",
        duration: 6000,
      });
      return;
    }
    try {
      if (id && id !== "new") {
        await axios.put(`http://localhost:3000/api/codes/${id}`, {
          code,
          title,
          language, // Include language in the request
        });
      } else {
        await axios.post("http://localhost:3000/api/codes", {
          code,
          title,
          language,
        });
      }
      navigate("/codelist");
    } catch (error) {
      console.error("Error saving code:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.errors?.map((err) => err.msg).join(", ") ||
          "Unable to save code",
        status: "error",
        duration: 6000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-gray-900 text-white shadow-lg transition duration-300">
        <h1 className="text-2xl font-extrabold">Programming Assistant</h1>
        <nav>
          <ul className="flex space-x-6">
            <Link to={"/home"}>
              <li>
                <a
                  href="#features"
                  className="hover:text-green-400 transition duration-200"
                >
                  Home
                </a>
              </li>
            </Link>
            <li>
              <a
                href="#features"
                className="hover:text-green-400 transition duration-200"
              >
                Features
              </a>
            </li>
            <Link to={"/test"}>
              <li>
                <a
                  href="#features"
                  className="hover:text-green-400 transition duration-200"
                >
                  Exams
                </a>
              </li>
            </Link>
            <li>
              <a
                href="#contact"
                className="hover:text-green-400 transition duration-200"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <Box minH="100vh" bg="0f0a19" color="gray.500" px={6} py={8}>
        <HStack spacing={4}>
          <Box w="50%">
            <Input
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              mb={4}
            />
            <LanguageSelector language={language} onSelect={onSelect} />
            <Editor
              height="75vh"
              theme="vs-dark"
              language={language}
              defaultValue={id === "new" ? "" : CODE_SNIPPETS[language]}
              onMount={onMount}
              value={value}
              onChange={(value) => setValue(value)}
            />
            <Button
              variant="outline"
              colorScheme="blue"
              mt={4}
              onClick={saveCode}
            >
              Save Code
            </Button>
          </Box>
          <Output editorRef={editorRef} language={language} />
        </HStack>
      </Box>
      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center p-4">
        <p>&copy; 2024 Programming Assistant. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a
            href="/privacy"
            className="text-gray-400 hover:underline transition duration-200"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-gray-400 hover:underline transition duration-200"
          >
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
};

export default CodeEditor;
