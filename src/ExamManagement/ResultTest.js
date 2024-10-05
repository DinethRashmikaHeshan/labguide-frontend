import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf'; // Import jsPDF
import 'jspdf-autotable'; // Import the jsPDF autotable plugin

function ResultTest() {
    const [results, setResults] = useState([]);
    const { id: examID } = useParams();

    useEffect(() => {
        getResults();
    }, []);

    const getResults = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/exam/results/${examID}`);
            setResults(res.data); // Set the fetched exam results
        } catch (error) {
            alert("Error: " + error.response.data);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(22);
        doc.setTextColor(50, 50, 100); // Set header text color
        doc.text('LabGuide', 14, 10); // Set the main header title
    
        // Subtitle
        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100); // Set subtitle text color
        doc.text('Exam Attendance Report', 14, 18); // Subtitle for the section
    
        // Decorative line
        doc.setLineWidth(0.5);
        doc.setDrawColor(100, 100, 100); // Line color
        doc.line(14, 22, 196, 22); // Draw a line across the header
    
        // Table headers
        const tableColumn = ["Registration No", "Exam Date", "Total Questions Answered"];
        const tableRows = [];
    
        // Create a Set to count unique registration IDs
        const uniqueRegistrationNos = new Set();
    
        results.forEach(result => {
            const examData = [
                result.registrationNo,
                new Date(result.date).toLocaleDateString(), // Format date
                result.answers.length // Assuming answers is an array; adjust if needed
            ];
            tableRows.push(examData);
            uniqueRegistrationNos.add(result.registrationNo); // Add to Set for unique count
        });
    
        // Calculate total attendance based on unique registration IDs
        const totalAttendance = uniqueRegistrationNos.size; // Unique count of registration IDs
    
        // Add the table to the PDF with styling
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            theme: 'grid', // Set the theme to 'grid'
            headStyles: {
                fillColor: [100, 130, 173], // Header background color
                textColor: [255, 255, 255], // Header text color
                fontSize: 12,
                fontStyle: 'bold',
            },
            styles: {
                fillColor: [255, 255, 255], // Body background color
                textColor: [0, 0, 0], // Body text color
                lineColor: [0, 0, 0], // Line color for borders
                lineWidth: 0.1, // Line width for borders
                fontSize: 10,
                halign: 'center', // Center align text
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240], // Light gray for alternate rows
            },
        });
    
        // Add total attendance as a new row in the PDF
        doc.text(`Total Attendance: ${totalAttendance}`, 14, doc.lastAutoTable.finalY + 10);
        
        // Add a footer
        const pageHeight = doc.internal.pageSize.height; // Get the page height
        const footerText = `Generated on: ${new Date().toLocaleDateString()}`;
        doc.setFontSize(10);
        doc.text(footerText, 14, pageHeight - 10); // Position footer 10 units from the bottom
    
        // Save the generated PDF
        doc.save(`exam_attendance_${examID}.pdf`); // Updated filename
    };
    
    

    return (
        <div className="min-h-screen bg-gradient-to-r from-[#6482AD] to-[#7FA1C3] p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-[#6482AD] mb-4">Exam Attendance</h1> {/* Updated heading */}
                
                {results.length > 0 ? (
                    <>
                        <table className="table-auto w-full bg-white shadow-md rounded-lg">
                            <thead>
                                <tr className="bg-[#6482AD] text-white">
                                    <th className="px-4 py-2">Registration No</th>
                                    <th className="px-4 py-2">Exam Date</th>
                                    <th className="px-4 py-2">Total Questions Answered</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((result, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="px-4 py-2 text-center">{result.registrationNo}</td>
                                        <td className="px-4 py-2 text-center">
                                            {new Date(result.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {result.answers.length} {/* Adjust if necessary */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Button to Generate PDF */}
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded shadow"
                                onClick={generatePDF}
                            >
                                Download PDF
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-lg text-center text-gray-700">No results available.</p>
                )}
            </div>
        </div>
    );
}

export default ResultTest;
