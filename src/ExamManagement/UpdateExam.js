import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateExam() {
    const { examId } = useParams();
    const [exam, setExam] = useState({
        examDetails: '',
        eDate: '',
        eTime: '',
        duration: ''
    });
    const navigate = useNavigate();
    const [today, setToday] = useState("");

    useEffect(() => {
        getExam();
        setMinDate(); // Set minimum date to today
    }, []);

    const getExam = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/exam/exam/each/${examId}`);
            const fetchedExam = res.data.exam;

            // Extract hours and minutes from the eTime (assuming the time is in HH:MM:SS format)
            const timeWithoutSeconds = fetchedExam.eTime.slice(0, 5); // Extract "HH:MM" from "HH:MM:SS"

            setExam({
                examDetails: fetchedExam.examDetails,
                eDate: fetchedExam.eDate.split('T')[0], // Format date for input field (YYYY-MM-DD)
                eTime: timeWithoutSeconds, // Set time in "HH:MM" format
                duration: fetchedExam.duration
            });
        } catch (error) {
            alert("Error: " + error.response.data);
        }
    };

    // Set the minimum date as today in YYYY-MM-DD format
    const setMinDate = () => {
        const todayDate = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
        setToday(todayDate);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExam((prevExam) => ({
            ...prevExam,
            [name]: value
        }));
    };

    const updateExam = async (e) => {
        e.preventDefault(); // Prevent form submission refresh
        try {
            await axios.put(`http://localhost:3000/exam/exam/update/${examId}`, exam);
            alert("Exam updated successfully!");
            navigate('/exams'); // Redirect back to the exams list page
        } catch (error) {
            alert("Error updating exam: " + error.response.data);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-[#6482AD] to-[#7FA1C3] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-[#6482AD] mb-6">Update Exam</h1>
                <form onSubmit={updateExam}>
                    <div className="mb-4">
                        <label className="block text-lg font-semibold mb-2">Exam Details</label>
                        <input
                            type="text"
                            name="examDetails"
                            value={exam.examDetails}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6482AD]"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg font-semibold mb-2">Exam Date</label>
                        <input
                            type="date"
                            name="eDate"
                            value={exam.eDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6482AD]"
                            min={today} // Set minimum date as today
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg font-semibold mb-2">Exam Time</label>
                        <input
                            type="time"
                            name="eTime"
                            value={exam.eTime}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6482AD]"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg font-semibold mb-2">Duration (minutes)</label>
                        <input
                            type="number"
                            name="duration"
                            value={exam.duration}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6482AD]"
                            required
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="bg-[#6482AD] text-white py-2 px-4 rounded-md hover:bg-[#7FA1C3] focus:outline-none focus:ring-2 focus:ring-[#7FA1C3]"
                        >
                            Update Exam
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/exams')}
                            className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Back
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateExam;
