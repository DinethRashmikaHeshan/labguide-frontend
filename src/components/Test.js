import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Test() {
    const [exams, setExams] = useState([]);
    const [openIndex, setOpenIndex] = useState(null); // State to track which accordion is open

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
                                            <Link to={`/testQuestions/${exam._id}`}>
                                                <button
                                                    className={`py-2 px-6 rounded-md focus:outline-none focus:ring-2 transition duration-200 ${
                                                        isPast
                                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                                            : 'bg-[#6482AD] text-white hover:bg-[#7FA1C3]'
                                                    }`}
                                                    disabled={isPast}
                                                >
                                                    DO EXAM
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Test;
