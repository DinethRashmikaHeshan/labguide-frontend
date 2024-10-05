import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  DownloadIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import { useNavigate, Link } from "react-router-dom";

const CodeListPage = ({ username, userId }) => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(""); // State for the filter
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/codes/${userId}`
        );
        setCodes(response.data);
      } catch (error) {
        setError("Failed to fetch codes. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to fetch codes. Please try again later.",
          status: "error",
          duration: 6000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCodes();
  }, [toast]);

  // Filter codes by title
  const filteredCodes = codes.filter((code) =>
    code.title.toLowerCase().includes(filter.toLowerCase())
  );

  const generatePDF = (codes) => {
    const doc = new jsPDF();

    // Set a background color for the entire page
    doc.setFillColor(30, 30, 30); // Dark background (RGB values)
    doc.rect(
      0,
      0,
      doc.internal.pageSize.width,
      doc.internal.pageSize.height,
      "F"
    ); // Fill entire page

    // Heading Section Background
    doc.setFillColor(22, 160, 133); // Teal color for heading section
    doc.rect(0, 0, doc.internal.pageSize.width, 30, "F"); // Heading background rectangle

    // Set the app's name as the main heading with white text, bold, and larger font size
    doc.setFontSize(26); // Increase font size
    doc.setFont("helvetica", "bold"); // Set font to bold
    doc.setTextColor(255, 255, 255); // White text for the main heading
    doc.text("<Lab Guide/>", 105, 18, null, null, "center");

    // Sub-heading: Set the report title
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255); // White text
    doc.text("Code Submissions Report", 105, 28, null, null, "center");

    // Display the current PDF generation date in the top-left corner with white text
    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255); // White text
    doc.text(`Report generated on: ${currentDate}`, 10, 35);

    // Define a margin for the content
    let startY = 45;

    // Create table headers with teal background and white text
    const tableHeaders = [["Title", "Language", "Submission Date"]];

    // Map code data to rows
    const tableData = codes.map((code) => [
      code.title,
      code.language,
      new Date(code.submissionDate).toLocaleDateString(),
    ]);

    // Use jsPDF autotable for a clean table layout with matching theme
    doc.autoTable({
      head: tableHeaders,
      body: tableData,
      startY,
      theme: "grid", // Use a grid theme for better styling
      margin: { top: 40 },
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] }, // Teal background, white text
      bodyStyles: {
        valign: "middle",
        textColor: [255, 255, 255],
        fillColor: [50, 50, 50],
      }, // White text, dark grey row
      alternateRowStyles: { fillColor: [40, 40, 40] }, // Darker grey for alternate rows
      styles: { fillColor: [30, 30, 30], textColor: [255, 255, 255] }, // Dark grey background, white text for table
    });

    // Add a footer with white text and teal line
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Draw a teal line at the footer
      doc.setDrawColor(22, 160, 133);
      doc.line(
        10,
        doc.internal.pageSize.height - 15,
        doc.internal.pageSize.width - 10,
        doc.internal.pageSize.height - 15
      );

      // Add footer text
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255); // White text
      doc.text(
        `Page ${i} of ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        null,
        null,
        "center"
      );
    }

    // Save the PDF
    doc.save("LabGuide_Code_Submissions_Report.pdf");
  };

  const deleteCode = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/codes/${id}`);
      setCodes(codes.filter((code) => code._id !== id)); // Update state
      toast({
        title: "Success",
        description: "Code deleted successfully.",
        status: "success",
        duration: 6000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete code. Please try again later.",
        status: "error",
        duration: 6000,
      });
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-gray-900 text-white shadow-lg transition duration-300">
        <h1 className="text-2xl font-extrabold">&lt;Lab Guide/&gt;</h1>
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
            <Link to={"/report"}>
              <li>
                <a
                  href="#features"
                  className="hover:text-green-400 transition duration-200"
                >
                  Report
                </a>
              </li>
            </Link>
            <Link to={"/code/:userId"}>
              <li>
                <a
                  href="#mycodes"
                  className="hover:text-green-400 transition duration-200"
                >
                  My Codes
                </a>
              </li>
            </Link>
          </ul>
        </nav>
      </header>

      <Box p={4}>
        <HStack justifyContent="space-between" mb={4}>
          <Text fontSize="2xl" fontWeight="bold">
            Saved Codes
          </Text>
          <Button
            colorScheme="blue"
            leftIcon={<AddIcon />}
            onClick={() => navigate("/code/new")}
          >
            Create New Code
          </Button>
        </HStack>

        {/* Custom Search Bar */}
        <InputGroup mb={4}>
          <Input
            placeholder="Search codes by title..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            borderColor="gray.300"
            _hover={{ borderColor: "gray.400" }}
            focusBorderColor="blue.500"
            boxShadow="sm"
          />
          <InputRightElement pointerEvents="none">
            <SearchIcon color="gray.500" />
          </InputRightElement>
        </InputGroup>

        <VStack spacing={4} align="stretch">
          {filteredCodes.map((code) => (
            <Box
              key={code._id}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="md"
              _hover={{ boxShadow: "lg", cursor: "pointer" }}
            >
              <HStack justifyContent="space-between">
                <Text fontSize="lg" fontWeight="semibold">
                  {code.title}
                </Text>
                <HStack>
                  <Button
                    leftIcon={<EditIcon />}
                    colorScheme="yellow"
                    aria-label="Edit Code"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/code/${code._id}/${userId}`);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    leftIcon={<DeleteIcon />}
                    colorScheme="red"
                    aria-label="Delete Code"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCode(code._id);
                    }}
                  >
                    Delete
                  </Button>
                </HStack>
              </HStack>
            </Box>
          ))}
        </VStack>

        {/* Move the Generate PDF Button below the code list and right align */}
        <HStack justifyContent="flex-end" mt={8} mr={4}>
          <Button
            leftIcon={<DownloadIcon />}
            colorScheme="green"
            onClick={() => generatePDF(filteredCodes)}
          >
            Generate PDF
          </Button>
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

export default CodeListPage;
