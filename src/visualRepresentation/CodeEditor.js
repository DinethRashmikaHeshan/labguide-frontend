import { Box, HStack, Button, Input, useToast } from "@chakra-ui/react";
import React, { useRef, useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

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
      navigate("/");
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
    <Box>
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
  );
};

export default CodeEditor;
