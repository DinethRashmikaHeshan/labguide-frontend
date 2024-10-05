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

    // Function to generate a PDF for the exam attendance
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Exam Attendance', 14, 22); // Updated text
        
        // Define table columns including "Total Questions Answered"
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

        // Add the table to the PDF
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
        });

        // Add total attendance as a new row in the PDF
        doc.text(`Total Attendance: ${totalAttendance}`, 14, doc.lastAutoTable.finalY + 10);
        
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
