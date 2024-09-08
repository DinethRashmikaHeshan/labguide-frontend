import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

function Questions() {
    const { id } = useParams()
    const [questions, setQuestions] = useState([])

    useEffect(() => {
        getQuestion()
    })

    const getQuestion = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/exam/exam/${id}`)
            setQuestions(res.data)
        } catch (error) {
            alert("Error: " + error.response.data)
        }
    }

    const delQues = async (quesId) => {
        try {
            await axios.delete(`http://localhost:3000/exam/exam/${id}/question/${quesId}`)
            console.log(quesId)
            alert("Question Deleted")
            getQuestion()
        } catch (error) {
            alert("Error: " + error.response.data)
        }
    }
    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-6482AD to-7FA1C3 p-8">
            <h1 className="text-3xl font-bold text-6482AD mb-6">Questions</h1>

            <h3 className="mb-6">
                <Link to={`/createQuestion/${id}`}>
                    <button className="bg-6482AD text-white py-2 px-4 rounded-lg hover:bg-7FA1C3 transition duration-200">
                        Add New Question
                    </button>
                </Link>

                <Link to={`/exams`}>
                    <button className="bg-6482AD text-white py-2 px-4 ml-2 rounded-lg hover:bg-7FA1C3 transition duration-200">
                        Back
                    </button>
                </Link>

            </h3>

            <div className="w-full max-w-3xl space-y-4">
                {questions.map((question, index) => (
                    <div key={index} className="p-6 bg-F5EDED rounded-lg shadow-md">
                        {question.questionType === 'SingleChoiceQuestion' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="font-medium text-lg text-7FA1C3">Type: </label>
                                    <p className="text-gray-700 text-2xl">{question.questionType}</p>
                                </div>
                                <div>
                                    <label className="font-medium text-lg text-7FA1C3">Question: </label>
                                    <p className="text-gray-700 text-xl">{question.question}</p>
                                </div>
                                <div>
                                    <label className="font-medium text-lg text-7FA1C3">Marks: </label>
                                    <p className="text-gray-700 text-xl">{question.marks}</p>
                                </div>
                                <div>
                                    <label className="font-medium text-lg text-7FA1C3">Options: </label>
                                    <p className="text-gray-700 text-xl">{question.options.join(', ')}</p>
                                </div>
                                <div>
                                    <label className="font-medium text-lg text-7FA1C3">Correct Answer: </label>
                                    <p className="text-gray-700 text-xl">{question.correctAnswer}</p>
                                </div>
                            </div>
                        )}

                        {question.questionType === 'MultiChoiceQuestion' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="font-medium text-lg text-7FA1C3">Type: </label>
                                    <p className="text-gray-700 text-2xl">{question.questionType}</p>
                                </div>
                                <div>
                                    <label className="font-medium text-lg text-7FA1C3">Question: </label>
                                    <p className="text-gray-700 text-xl">{question.question}</p>
                                </div>
                                <div>
                                    <label className="font-medium text-lg text-7FA1C3">Marks: </label>
                                    <p className="text-gray-700 text-xl">{question.marks}</p>
                                </div>
                                <div>
                                    <label className="font-medium text-lg text-7FA1C3">Options: </label>
                                    <p className="text-gray-700 text-xl">{question.options.join(', ')}</p>
                                </div>
                                <div>
                                    <label className="font-medium text-lg text-7FA1C3">Correct Answers: </label>
                                    <p className="text-gray-700 text-xl">{question.correctAnswers.join(', ')}</p>
                                </div>
                            </div>
                        )}


                        {question.questionType === 'EssayQuestion' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="font-medium text-lg text-7FA1C3">Type: </label>
                                    <p className="text-gray-700 text-2xl">{question.questionType}</p>
                                </div>
                                <div>
                                    <label className="font-medium text-lg text-7FA1C3">Question: </label>
                                    <p className="text-gray-700 text-xl">{question.question}</p>
                                </div>
                                <div>
                                    <label className="font-medium text-lg text-7FA1C3">Marks: </label>
                                    <p className="text-gray-700 text-xl">{question.marks}</p>
                                </div>
                                <div>
                                    <label className="font-medium text-lg text-7FA1C3">Word Limit: </label>
                                    <p className="text-gray-700 text-xl">{question.wordLimit}</p>
                                </div>
                            </div>
                        )}


                        <button className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-500 transition duration-200"
                            onClick={() => delQues(question._id)}>
                            Delete
                        </button><button className="mt-4 bg-green-600 text-white py-2 px-4 ml-2 rounded-lg hover:bg-green-500 transition duration-200">
                            Update
                        </button>
                    </div>
                ))}
            </div>
        </div>


    )
}

export default Questions