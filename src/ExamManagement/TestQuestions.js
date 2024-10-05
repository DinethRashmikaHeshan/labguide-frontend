import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function TestQuestions() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showSummary, setShowSummary] = useState(false);
    const [registrationNo, setRegistrationNo] = useState('');
    const [exam, setExam] = useState({});
    const [timeLeft, setTimeLeft] = useState(0); // Initialize to 0

    // Use effect to set registration number if available
    useEffect(() => {
        if (location.state && location.state.registrationNo) {
            setRegistrationNo(location.state.registrationNo);
        }
    }, [location.state]);

    // Fetch questions and exam when component mounts
    useEffect(() => {
        getExam();
        getQuestions();
    }, []);

    const getExam = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/exam/exam/each/${id}`);
            const fetchedExam = res.data.exam;
            setExam(fetchedExam);
            setTimeLeft(fetchedExam.duration * 60); // Set time left in seconds (duration in minutes)
        } catch (error) {
            alert("Error: " + error.response.data);
        }
    };

    const getQuestions = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/exam/exam/${id}`);
            setQuestions(res.data);
        } catch (error) {
            alert("Error: " + (error.response?.data || error.message));
        }
    };

    // Timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 0) {
                    clearInterval(timer);
                    finishExam(); // Automatically finish the exam when time is up
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(timer);
    }, []);

    const handleAnswerChange = (questionId, questionText, answer) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: {
                questionText: questionText,
                answer: answer
            }
        }));
    };

    const saveAnswer = async () => {
        const formattedAnswers = Object.entries(answers).map(([questionId, { questionText, answer }]) => ({
            questionId: questionId,
            questionText: questionText,
            answer: answer
        }));

        try {
            await axios.post(`http://localhost:3000/exam/results`, {
                examId: id,
                registrationNo: registrationNo,
                answers: formattedAnswers,
                date: new Date(), // Add current date and time
            });
            console.log('Answers saved successfully:', formattedAnswers);
            console.log(id,registrationNo,formattedAnswers)
        } catch (error) {
            console.error('Error saving answers:', error.response?.data || error.message);
        }
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const finishExam = () => {
        setShowSummary(true);
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const renderQuestion = (question) => {
        switch (question.questionType) {
            case 'SingleChoiceQuestion':
                return (
                    <div>
                        <p>{question.question}</p>
                        {question.options.map((option, index) => (
                            <div key={index}>
                                <input
                                    type="radio"
                                    name={question._id}
                                    value={option}
                                    onChange={() => handleAnswerChange(question._id, question.question, option)} // Pass question text
                                    checked={answers[question._id]?.answer === option} // Adjust checked condition
                                />
                                {option}
                            </div>
                        ))}
                    </div>
                );
            case 'MultiChoiceQuestion':
                return (
                    <div>
                        <p>{question.question}</p>
                        {question.options.map((option, index) => (
                            <div key={index}>
                                <input
                                    type="checkbox"
                                    name={question._id}
                                    value={option}
                                    onChange={(e) => {
                                        const currentAnswers = answers[question._id]?.answer || [];
                                        const updatedAnswers = e.target.checked
                                            ? [...currentAnswers, option]
                                            : currentAnswers.filter(a => a !== option);
                                        handleAnswerChange(question._id, question.question, updatedAnswers); // Pass question text
                                    }}
                                    checked={answers[question._id]?.answer?.includes(option)} // Adjust checked condition
                                />
                                {option}
                            </div>
                        ))}
                    </div>
                );
            case 'EssayQuestion':
                return (
                    <div>
                        <p>{question.question}</p>
                        <textarea
                            rows="6"
                            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md text-lg"
                            onChange={(e) => handleAnswerChange(question._id, question.question, e.target.value)} // Pass question text
                            value={answers[question._id]?.answer || ''}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    const renderSummary = () => {
        return (
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
                <h1 className="text-2xl font-bold mb-4">Summary of Your Answers</h1>
                {questions.map((question, index) => (
                    <div key={question._id} className="mb-4">
                        <p className="font-semibold">Question {index + 1}: {question.question}</p>
                        {question.questionType === 'EssayQuestion' ? (
                            <textarea
                                className="w-full p-4 border border-gray-300 rounded-md text-lg"
                                rows="6"
                                readOnly
                                value={answers[question._id]?.answer || 'No answer provided'}
                            />
                        ) : (
                            <p className="italic">
                                Your Answer: {Array.isArray(answers[question._id]?.answer) 
                                    ? answers[question._id]?.answer.join(', ') 
                                    : answers[question._id]?.answer || 'No answer provided'}
                            </p>
                        )}
                    </div>
                ))}
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded mt-6"
                    onClick={finishAndSubmit}
                >
                    Finish Exam
                </button>
            </div>
        );
    };

    const finishAndSubmit = () => {
        saveAnswer(); // Call saveAnswer here to save the answers
        alert('Your answers have been submitted successfully!');
        navigate('/test'); // Redirect to home or another page after the exam
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-[#6482AD] to-[#7FA1C3] p-8 flex flex-col">
            <div className="fixed top-4 right-4 bg-white text-xl p-4 rounded shadow">
                Time Left: {formatTime(timeLeft)}
            </div>

            <div className="flex-grow flex items-center justify-center">
                {showSummary ? renderSummary() : (
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
                        <h1 className="text-2xl font-bold mb-4">Exam: {exam.name}</h1>
                        <p className="mb-6">{exam.description}</p>

                        {questions.length > 0 ? renderQuestion(questions[currentQuestionIndex]) : <p>Loading questions...</p>}

                        <div className="flex justify-between mt-6">
                            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded" onClick={prevQuestion} disabled={currentQuestionIndex === 0}>
                                Previous
                            </button>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={nextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
                                Next
                            </button>
                        </div>

                        <button className="bg-green-500 text-white px-4 py-2 rounded mt-4" onClick={finishExam}>
                            Finish Exam
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TestQuestions;
