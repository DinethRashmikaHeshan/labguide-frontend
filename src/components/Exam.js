import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Exam() {
    const [exams, setExam] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null); // State to track the active accordion index

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

    const deleteExam = async (examID) => {
        try {
            await axios.delete(`http://localhost:3000/exam/exam/${examID}`);
            alert(`Exam Deleted`);
            getExams();
        } catch (error) {
            alert("Error: " + error.response.data);
        }
    };

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index); // Toggle active index
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-6482AD to-7FA1C3 p-8">
            <div className="bg-F5EDED p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-6482AD mb-6">Exams</h1>
                <Link to={`/createExam`}>
                    <button
                        className="bg-6482AD text-white py-3 px-6 rounded-md mb-4 hover:bg-7FA1C3 focus:outline-none focus:ring-2 focus:ring-7FA1C3"
                    >
                        Create a new EXAM
                    </button>
                </Link>
                <div>
                    {exams.map((exam, index) => {
                        // Alternate between light and dark colors
                        const cardClass = index % 2 === 0 ? "bg-E2DAD6 text-6482AD" : "bg-6482AD text-F5EDED";

                        return (
                            <div key={index} className={`mb-4 rounded-lg shadow-md`}>
                                <div 
                                    className={`${cardClass} p-4 cursor-pointer`} 
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <h2 className="text-lg font-semibold">{exam.examDetails}</h2>
                                    <p className="text-md">Date: {exam.eDate.split('T')[0]} | Time: {exam.eTime}</p>
                                </div>
                                {activeIndex === index && (
                                    <div className={`${cardClass} p-4 border border-7FA1C3`}>
                                        <div className="mb-4">
                                            <label className="block text-lg font-semibold">Exam Duration:</label>
                                            <p className="text-md">{exam.duration} min</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <button
                                                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                onClick={() => deleteExam(exam._id)}
                                            >
                                                DELETE
                                            </button>
                                            <Link to={`/question/${exam._id}`}>
                                                <button
                                                    className="bg-7FA1C3 text-white py-2 px-4 rounded-md hover:bg-6482AD focus:outline-none focus:ring-2 focus:ring-6482AD"
                                                >
                                                    See More
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

export default Exam;
