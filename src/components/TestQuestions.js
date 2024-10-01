import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function TestQuestions() {
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

    console.log(questions)
  return (
    <div>TestQuestions</div>
  )
}

export default TestQuestions