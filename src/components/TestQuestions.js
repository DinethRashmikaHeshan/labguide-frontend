import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

function TestQuestions() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [questions, setQuestions] = useState([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [timeLeft, setTimeLeft] = useState(1200) // 20 minutes for example
    const [answers, setAnswers] = useState({}) // To store user answers
    const [showSummary, setShowSummary] = useState(false) // To display summary page

    useEffect(() => {
        getQuestions()
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 0) {
                    clearInterval(timer)
                    finishExam() // Automatically finish the exam when time is up
                    return 0
                }
                return prevTime - 1
            })
        }, 1000)

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(timer)
    }, [])

    const getQuestions = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/exam/exam/${id}`)
            setQuestions(res.data)
        } catch (error) {
            alert("Error: " + error.response?.data || error.message)
        }
    }

    const handleAnswerChange = (questionId, answer) => {
        setAnswers({ ...answers, [questionId]: answer })
    }

    const saveAnswer = async () => {
        try {
            // Save the current answers (You can customize this to match your backend structure)
            await axios.post(`http://localhost:3000/exam/submit`, {
                examId: id,
                answers: answers,
            })
        } catch (error) {
            console.error('Error saving answers:', error.response?.data || error.message)
        }
    }

    const nextQuestion = () => {
        saveAnswer() // Save the answer before moving to the next question
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
        }
    }

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1)
        }
    }

    const finishExam = () => {
        saveAnswer() // Save answers before finishing
        setShowSummary(true) // Display the summary page
    }

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60)
        const seconds = timeInSeconds % 60
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }

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
                                    onChange={() => handleAnswerChange(question._id, option)}
                                    checked={answers[question._id] === option}
                                />
                                {option}
                            </div>
                        ))}
                    </div>
                )
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
                                        const currentAnswers = answers[question._id] || []
                                        const updatedAnswers = e.target.checked
                                            ? [...currentAnswers, option]
                                            : currentAnswers.filter(a => a !== option)
                                        handleAnswerChange(question._id, updatedAnswers)
                                    }}
                                    checked={answers[question._id]?.includes(option)}
                                />
                                {option}
                            </div>
                        ))}
                    </div>
                )
            case 'EssayQuestion':
                return (
                    <div>
                        <p>{question.question}</p>
                        <textarea
                            rows="6"
                            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md text-lg"
                            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                            value={answers[question._id] || ''}
                        />
                    </div>
                )
            default:
                return null
        }
    }

    // Summary page that shows the question number and submitted answer
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
                                value={answers[question._id] || 'No answer provided'}
                            />
                        ) : (
                            <p className="italic">
                                Your Answer: {Array.isArray(answers[question._id]) 
                                    ? answers[question._id].join(', ') 
                                    : answers[question._id] || 'No answer provided'}
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
        )
    }

    const finishAndSubmit = () => {
        alert('Your answers have been submitted successfully!')
        navigate('/test') // Redirect to home or another page after the exam
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-6482AD to-7FA1C3 p-8 flex flex-col items-center">
            <div className="fixed top-4 right-4 bg-white text-xl p-4 rounded shadow">
                Time Left: {formatTime(timeLeft)}
            </div>

            {showSummary ? (
                renderSummary() // Show summary page if the exam is finished
            ) : (
                questions.length > 0 && (
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
                        <h1 className="text-2xl font-bold mb-4">Question {currentQuestionIndex + 1}/{questions.length}</h1>
                        {renderQuestion(questions[currentQuestionIndex])}

                        <div className="flex justify-between mt-6">
                            {/* Show 'Previous' button only after the first question */}
                            {currentQuestionIndex > 0 && (
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={prevQuestion}
                                >
                                    Previous
                                </button>
                            )}
                            
                            {/* If it's the last question, show 'Finish', otherwise 'Next' */}
                            {currentQuestionIndex === questions.length - 1 ? (
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                    onClick={finishExam}
                                >
                                    Finish
                                </button>
                            ) : (
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={nextQuestion}
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                )
            )}
        </div>
    )
}

export default TestQuestions
