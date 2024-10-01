import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Test() {
    const [exams, setExams] = useState([]);
    const [openIndex, setOpenIndex] = useState(null); // State to track which accordion is open
    const [registrationNo, setRegistrationNo] = useState(''); // State for registration number
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
    const [selectedExamId, setSelectedExamId] = useState(null); // State to track the selected exam
    const navigate = useNavigate(); // Hook to programmatically navigate

    useEffect(() => {
        getExams();
    }, []);

    const getExams = async () => {
        try {
            const res = await axios.get('http://localhost:3000/exam/exam');
            setExams(res.data);
        } catch (error) {
            alert('Error: ' + (error.response?.data || error.message));
        }
    };

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index); // Toggle accordion open/close
    };

    const handleDoExamClick = (examId) => {
        setSelectedExamId(examId); // Set the selected exam ID
        setIsModalOpen(true); // Open modal for registration number input
    };

    const handleRegistrationSubmit = () => {
        // Navigate to the test questions page with the exam ID and registration number
        navigate(`/testQuestions/${selectedExamId}`, { state: { registrationNo } });
        setIsModalOpen(false); // Close the modal
        setRegistrationNo(''); // Reset the registration number
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-[#6482AD] to-[#7FA1C3] p-8">
            <div className="bg-[#F5EDED] p-8 rounded-lg shadow-lg max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-[#6482AD] mb-8 text-center">Exams</h1>
                <div className="space-y-4">
                    {exams.map((exam, index) => {
                        const currentDate = new Date();
                        const examDate = new Date(exam.eDate);
                        const isPast = examDate < currentDate;

                        return (
                            <div key={index} className="bg-[#E2DAD6] rounded-lg shadow-md transition-shadow duration-200">
                                <div className="p-4 cursor-pointer" onClick={() => toggleAccordion(index)}>
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-semibold text-[#6482AD]">{exam.examDetails}</h2>
                                        <span className="text-[#7FA1C3]">
                                            {openIndex === index ? '▲' : '▼'}
                                        </span>
                                    </div>
                                </div>
                                {openIndex === index && (
                                    <div className="p-4 border-t border-[#7FA1C3]">
                                        <div className="mb-2">
                                            <label className="block text-md font-semibold text-[#7FA1C3]">Exam Date:</label>
                                            <p className="text-md text-[#6482AD]">{exam.eDate.split('T')[0]}</p>
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-md font-semibold text-[#7FA1C3]">Exam Time:</label>
                                            <p className="text-md text-[#6482AD]">{exam.eTime}</p>
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-md font-semibold text-[#7FA1C3]">Exam Duration:</label>
                                            <p className="text-md text-[#6482AD]">{exam.duration} min</p>
                                        </div>
                                        <div className="flex justify-center">
                                            <button
                                                className={`py-2 px-6 rounded-md focus:outline-none focus:ring-2 transition duration-200 ${
                                                    isPast
                                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                                        : 'bg-[#6482AD] text-white hover:bg-[#7FA1C3]'
                                                }`}
                                                onClick={() => handleDoExamClick(exam._id)}
                                                disabled={isPast}
                                            >
                                                DO EXAM
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal for Registration Number Input */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Enter Registration Number</h2>
                        <input
                            type="text"
                            value={registrationNo}
                            onChange={(e) => setRegistrationNo(e.target.value)}
                            placeholder="Registration Number"
                            className="border border-gray-300 p-2 rounded w-full mb-4"
                        />
                        <div className="flex justify-end">
                            <button
                                className="bg-[#6482AD] text-white px-4 py-2 rounded hover:bg-[#7FA1C3] mr-2"
                                onClick={handleRegistrationSubmit}
                            >
                                Submit
                            </button>
                            <button
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Test;
