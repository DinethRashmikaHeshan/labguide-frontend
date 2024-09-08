import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Exam() {
    const [exams, setExam] = useState([])

    useEffect(() => {
        getExams()
    }, [])

    const getExams = async () => {
        try {
            const res = await axios.get("http://localhost:3000/exam/exam")
            // console.log(res.data)
            setExam(res.data)
        } catch (error) {
            alert("Error: " + error.response.data)
        }
    }

    const deleteExam = async (examID) => {
        try {
            await axios.delete(`http://localhost:3000/exam/exam/${examID}`)
            alert(`Exam Deleted`)
            getExams()
        } catch (error) {
            alert("Error: " + error.response.data)
        }
    }
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
                    {exams.map((exam, index) => (
                        <div className="bg-E2DAD6 p-6 rounded-lg shadow-md mb-6" key={index}>
                            <hr className="border-7FA1C3 my-4" />
                            <div className="mb-4">
                                <label className="block text-lg font-semibold text-7FA1C3">Exam Details:</label>
                                <p className="text-lg font-medium text-6482AD">{exam.examDetails}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-lg font-semibold text-7FA1C3">Exam Date:</label>
                                <p className="text-md text-6482AD">{exam.eDate.split('T')[0]}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-lg font-semibold text-7FA1C3">Exam Time:</label>
                                <p className="text-md text-6482AD">{exam.eTime}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-lg font-semibold text-7FA1C3">Exam Duration:</label>
                                <p className="text-md text-6482AD">{exam.duration} min</p>
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
                                        className="bg-6482AD text-white py-2 px-4 rounded-md hover:bg-7FA1C3 focus:outline-none focus:ring-2 focus:ring-7FA1C3"
                                    >
                                        See More
                                    </button>
                                </Link>

                            </div>
                            <hr className="border-7FA1C3 my-4" />
                        </div>
                    ))}
                </div>
            </div>
        </div>

    )
}

export default Exam