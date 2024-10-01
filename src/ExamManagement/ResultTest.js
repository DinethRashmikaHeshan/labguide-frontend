import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ResultTest() {
    const [questions, setQuestions] = useState([]); // Changed to plural for clarity
    const { id: examID } = useParams(); // Destructure examID from useParams

    useEffect(() => {
        getQuestions();
    }, ); // Added an empty dependency array to run only once

    const getQuestions = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/exam/results/${examID}`);
            setQuestions(res.data); // Set the fetched questions
        } catch (error) {
            alert("Error: " + error.response.data);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-[#6482AD] to-[#7FA1C3] p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-[#6482AD] mb-4">Exam Results</h1>
                {questions.length > 0 ? (
                    questions.map((question, index) => (
                        <div key={index} className="mb-6 p-4 border border-[#7FA1C3] rounded-md">
                            <p className="text-lg font-semibold">{question.registrationNo}</p>
                            {question.answers.map((answer, answerIndex) => (
                                <div key={answerIndex} className="mt-2 bg-[#F5EDED] p-4 rounded-md shadow-sm">
                                    <p className="font-medium">{answer.questionText}</p>
                                    <p className="text-gray-700">{answer.answer}</p>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <p className="text-lg text-center text-gray-700">No results available.</p>
                )}
            </div>
        </div>
    );
}

export default ResultTest;
