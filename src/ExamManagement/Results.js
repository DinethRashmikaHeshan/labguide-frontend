import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ClipboardDocumentListIcon, ChartBarIcon } from '@heroicons/react/24/outline'; // Importing Icons

function Results() {
    const [exams, setExam] = useState([]);

    useEffect(() => {
        getExams();
    }, []);

    const getExams = async () => {
        try {
            const res = await axios.get("http://localhost:3000/exam/exam");
            setExam(res.data);
        } catch (error) {
            alert("Error: " + error.response.data);
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-r from-[#6482AD] to-[#7FA1C3]">
            {/* Navigation - Fixed Position */}
            <nav className="bg-white p-6 shadow-lg rounded-lg w-64 h-screen fixed top-0 left-0 overflow-y-auto">
                <h1 className="text-2xl font-bold text-[#6482AD] mb-6">Instructor Dashboard</h1>
                <div className="flex flex-col">
                    <Link 
                        to="/exams" 
                        className="flex items-center text-lg text-[#6482AD] font-bold py-3 px-4 rounded-md mb-2 hover:bg-[#7FA1C3] hover:text-white transition duration-300"
                    >
                        <ClipboardDocumentListIcon className="h-6 w-6 mr-2" /> {/* Exam Icon */}
                        Exams
                    </Link>
                    <Link 
                        to="/results" 
                        className="flex items-center text-lg text-[#6482AD] font-bold py-3 px-4 rounded-md hover:bg-[#7FA1C3] hover:text-white transition duration-300"
                    >
                        <ChartBarIcon className="h-6 w-6 mr-2" /> {/* Results Icon */}
                        Results
                    </Link>
                </div>
            </nav>

            {/* Main Content - Scrollable */}
            <div className="ml-64 p-8 w-full overflow-y-auto" style={{ maxHeight: '100vh' }}>
                <h1 className="text-3xl font-bold text-white mb-8">Results</h1>
                {exams.map((exam, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-lg mb-6 flex items-center">
                        {/* Exam Icon */}
                        <ClipboardDocumentListIcon className="h-6 w-6 text-[#6482AD] mr-4" /> 
                        <h2 className="text-xl font-semibold text-[#6482AD] mb-2">
                            <Link 
                                to={`/results/${exam._id}`} 
                                className="hover:text-black transition duration-300"
                            >
                                {exam.examDetails}
                            </Link>
                        </h2>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Results;
