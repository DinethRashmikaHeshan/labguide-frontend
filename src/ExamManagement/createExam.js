import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function CreateExam() {
    const [details, setDetails] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [duration, setDuration] = useState('')

    const data = {
        examDetail: details,
        date: new Date(date),
        time: time,
        duration: Number(duration)
    }

    const sendData = async (event) => {
        event.preventDefault() // Prevent default form submission

        // Validate date and time
        const selectedDateTime = new Date(`${date}T${time}`)
        const now = new Date()
        if (selectedDateTime <= now) {
            alert("Please select a future date and time.")
            return
        }

        try {
            await axios.post("http://localhost:3000/exam/exam", data)
            alert("Exam Added")
        } catch (error) {
            alert("Error: " + (error.response?.data || "An unexpected error occurred"))
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-6482AD to-7FA1C3">
            <div className="bg-F5EDED p-8 rounded-lg shadow-lg max-w-lg w-full">
                <h1 className="text-3xl font-bold text-6482AD mb-6">Create Exam</h1>
                <form onSubmit={sendData} className="space-y-6">
                    <div>
                        <label htmlFor="details" className="block text-7FA1C3 text-lg font-medium mb-2">Exam Details</label>
                        <textarea
                            id="details"
                            onChange={(e) => setDetails(e.target.value)}
                            className="w-full p-3 border border-7FA1C3 rounded-md bg-E2DAD6 focus:outline-none focus:ring-2 focus:ring-6482AD"
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="eDate" className="block text-7FA1C3 text-lg font-medium mb-2">Date</label>
                        <input
                            type="date"
                            id="eDate"
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-3 border border-7FA1C3 rounded-md bg-E2DAD6 focus:outline-none focus:ring-2 focus:ring-6482AD"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="eTime" className="block text-7FA1C3 text-lg font-medium mb-2">Time</label>
                        <input
                            type="time"
                            id="eTime"
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full p-3 border border-7FA1C3 rounded-md bg-E2DAD6 focus:outline-none focus:ring-2 focus:ring-6482AD"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="eDuration" className="block text-7FA1C3 text-lg font-medium mb-2">Duration</label>
                        <input
                            type="number"
                            id="eDuration"
                            placeholder="in min"
                            min={1}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full p-3 border border-7FA1C3 rounded-md bg-E2DAD6 focus:outline-none focus:ring-2 focus:ring-6482AD"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-6482AD text-white py-3 rounded-md hover:bg-7FA1C3 focus:outline-none focus:ring-2 focus:ring-7FA1C3"
                    >
                        Create
                    </button>
                    <Link to="/exams">
                        <button
                            type="button"
                            className="w-full bg-7FA1C3 text-white py-3 rounded-md mt-3 hover:bg-6482AD focus:outline-none focus:ring-2 focus:ring-6482AD"
                        >
                            Back
                        </button>
                    </Link>
                </form>
            </div>
        </div>
    )
}

export default CreateExam
