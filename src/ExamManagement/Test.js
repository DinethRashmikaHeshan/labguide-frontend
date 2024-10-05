import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Test() {
    const [exams, setExams] = useState([]);
    const [openIndex, setOpenIndex] = useState(null); // State to track which accordion is open
    const [registrationNo, setRegistrationNo] = useState(''); // State for registration number
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
    const [selectedExamId, setSelectedExamId] = useState(null); // State to track the selected exam
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
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

    // Filter exams based on search query
    const filteredExams = exams.filter((exam) =>
        exam.examDetails.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#6482AD] to-[#7FA1C3]">
            {/* Header */}
            <header className="flex justify-between items-center p-6 bg-gray-900 text-white shadow-lg transition duration-300">
                <h1 className="text-2xl font-extrabold">Programming Assistant</h1>
                <nav>
                    <ul className="flex space-x-6">
                        <Link to={'./../'}><li><a href="#features" className="hover:text-green-400 transition duration-200">Home</a></li></Link>
                        <li><a href="#features" className="hover:text-green-400 transition duration-200">Features</a></li>
                        <li><a href="#resources" className="hover:text-green-400 transition duration-200">Exams</a></li>
                        <li><a href="#contact" className="hover:text-green-400 transition duration-200">Contact</a></li>
                    </ul>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-grow p-8">
                <div className="bg-[#F5EDED] p-8 rounded-lg shadow-lg max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-[#6482AD] mb-8 text-center">Exams</h2>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for exams..."
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                    </div>

                    <div className="space-y-4">
                        {filteredExams.map((exam, index) => {
                            const currentDate = new Date();
                            const examDate = new Date(exam.eDate);
                            const isPast = examDate < currentDate;

                            return (
                                <div key={index} className="bg-[#E2DAD6] rounded-lg shadow-md transition-shadow duration-200">
                                    <div className="p-4 cursor-pointer" onClick={() => toggleAccordion(index)}>
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold text-[#6482AD]">{exam.examDetails}</h3>
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
                                                    className={`py-2 px-6 rounded-md focus:outline-none focus:ring-2 transition duration-200 ${isPast
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
                    disabled={!registrationNo.trim()} // Disable if input is empty
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
            {registrationNo.trim() === '' && (
                <p className="text-red-500 mt-2">Registration number cannot be empty.</p>
            )}
        </div>
    </div>
)}

            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white text-center p-4">
                <p>&copy; 2024 Programming Assistant. All rights reserved.</p>
                <div className="flex justify-center space-x-4 mt-2">
                    <a href="/privacy" className="text-gray-400 hover:underline transition duration-200">Privacy Policy</a>
                    <a href="/terms" className="text-gray-400 hover:underline transition duration-200">Terms of Service</a>
                </div>
            </footer>
        </div>
    );
}

export default Test;
