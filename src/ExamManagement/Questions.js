import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function Questions() {
    const { id } = useParams();
    const [questions, setQuestions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null); // State to track the active question index

    useEffect(() => {
        getQuestion();
    },);

    const getQuestion = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/exam/exam/${id}`);
            setQuestions(res.data);
        } catch (error) {
            alert("Error: " + error.response.data);
        }
    };

    const delQues = async (quesId) => {
        try {
            await axios.delete(`http://localhost:3000/exam/exam/${id}/question/${quesId}`);
            alert("Question Deleted");
            getQuestion();
        } catch (error) {
            alert("Error: " + error.response.data);
        }
    };

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index); // Toggle active index
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-6482AD to-7FA1C3 p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Questions</h1>

            <div className="flex justify-between w-full max-w-3xl mb-6">
                <Link to={`/createQuestion/${id}`}>
                    <button className="bg-6482AD text-white py-2 px-4 rounded-lg hover:bg-7FA1C3 transition duration-200">
                        Add New Question
                    </button>
                </Link>

                <Link to={`/exams`}>
                    <button className="bg-6482AD text-white py-2 px-4 rounded-lg hover:bg-7FA1C3 transition duration-200">
                        Back
                    </button>
                </Link>
            </div>

            <div className="w-full max-w-3xl space-y-6">
                {questions.map((question, index) => (
                    <div key={index} className="rounded-lg shadow-md">
                        <div 
                            className="p-4 bg-F5EDED cursor-pointer rounded-lg" 
                            onClick={() => toggleAccordion(index)}
                        >
                            <h2 className="text-lg font-semibold">{question.question}</h2>
                            <p className="text-md text-gray-700">Type: {question.questionType} | Marks: {question.marks}</p>
                        </div>

                        {activeIndex === index && (
                            <div className={`bg-F5EDED p-4 border border-7FA1C3`}>
                                {/* <div className="flex flex-col md:flex-row md:space-x-6">
                                    <div className="flex-1">
                                        <label className="font-medium text-lg text-7FA1C3">Question:</label>
                                        <p className="text-gray-700 text-xl">{question.question}</p>
                                    </div>
                                </div> */}

                                {question.questionType === 'SingleChoiceQuestion' && (
                                    <div>
                                        <label className="font-medium text-lg text-7FA1C3">Options:</label>
                                        <p className="text-gray-700 text-xl">{question.options.join(', ')}</p>
                                        <label className="font-medium text-lg text-7FA1C3">Answer:</label>
                                        <p className="text-gray-700 text-xl">{question.correctAnswer}</p>
                                    </div>
                                )}

                                {question.questionType === 'MultiChoiceQuestion' && (
                                    <div>
                                        <label className="font-medium text-lg text-7FA1C3">Options:</label>
                                        <p className="text-gray-700 text-xl">{question.options.join(', ')}</p>
                                        <label className="font-medium text-lg text-7FA1C3">Answers:</label>
                                        <p className="text-gray-700 text-xl">{question.correctAnswers.join(', ')}</p>
                                    </div>
                                )}

                                {question.questionType === 'EssayQuestion' && (
                                    <div>
                                        <label className="font-medium text-lg text-7FA1C3">Word Limit:</label>
                                        <p className="text-gray-700 text-xl">{question.wordLimit}</p>
                                        <label className="font-medium text-lg text-7FA1C3">Answer:</label>
                                    <textarea
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl"
                                        rows="10"
                                        value={question.answer}
                                        readOnly
                                    ></textarea>
                                    </div>
                                )}

                                <div>
                                    
                                </div>

                                <div className="flex justify-between mt-4">
                                    <button
                                        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-500 transition duration-200"
                                        onClick={() => delQues(question._id)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="bg-green-600 text-white py-2 px-4 ml-2 rounded-lg hover:bg-green-500 transition duration-200"
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Questions;
