import React, { useState } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'

function CreateQuestion() {

  const { id } = useParams()

  const sendData = async (event) => {
    try {
      event.preventDefault()

      if (questionType === 'None') {
        alert('Please select a valid question type.')
        return
      }

      const data = {
        type: questionType,
        question,
        marks: Number(marks),
        allocatedTime: Number(time),
        options: optionsArray,
        correctAnswer,
        correctAnswers: correctAnswersArray,
        wordLimit: Number(wordLimit),
        answer: answer
      }

      console.log(data)

      await axios.put(`http://localhost:3000/exam/exam/${id}`, data)
      alert("Question Added")
    } catch (error) {
      alert("Error: " + error.response.data)

    }
  }

  const [questionType, setQuestionType] = useState('None')
  const [options, setOptions] = useState('')
  const [correctAnswers, setCorrectAnswers] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState(null)
  const [question, setQuestion] = useState('')
  const [marks, setMarks] = useState(null)
  const [time, setTime] = useState(null)
  const [wordLimit, setWordLimit] = useState(null)
  const [answer, setAnswer] = useState()

  const handleChange = (event) => {
    setQuestionType(event.target.value)
  }

  const handleOptionsChange = (event) => {
    setOptions(event.target.value)
  }


  const optionsArray = options.split(',').map(item => item.trim()).filter(item => item)
  const correctAnswersArray = correctAnswers.split(',').map(item => item.trim()).filter(item => item)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-6482AD to-7FA1C3 p-8">
      <form action="" onSubmit={sendData} className="bg-F5EDED p-8 rounded-lg shadow-lg w-full max-w-lg space-y-6">
        <h1 className="text-3xl font-bold text-6482AD mb-4">Create Question</h1>
        <div className="space-y-4">
          <div>
            <label htmlFor="questionType" className="block text-lg font-medium text-7FA1C3">Type:</label>
            <select
              name="questionType"
              id="questionType"
              value={questionType}
              onChange={handleChange}
              className="w-full p-2 border border-7FA1C3 rounded-md focus:outline-none focus:ring-2 focus:ring-6482AD"
            >
              <option value="None">None</option>
              <option value="SingleChoice">Single Choice</option>
              <option value="MultipleChoice">Multiple Choice</option>
              <option value="Essay">Essay</option>
            </select>
          </div>

          <div>
            <label htmlFor="question" className="block text-lg font-medium text-7FA1C3">Question:</label>
            <textarea
              id="question"
              required
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-3 border border-7FA1C3 rounded-md bg-E2DAD6 focus:outline-none focus:ring-2 focus:ring-6482AD"
              rows="3"
            ></textarea>
          </div>

          <div>
            <label htmlFor="marks" className="block text-lg font-medium text-7FA1C3">Marks:</label>
            <input
              type="number"
              id="marks"
              required
              onChange={(e) => setMarks(e.target.value)}
              className="w-full p-2 border border-7FA1C3 rounded-md focus:outline-none focus:ring-2 focus:ring-6482AD"
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-lg font-medium text-7FA1C3">Allocated Time (in minutes):</label>
            <input
              type="number"
              required
              min={1}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border border-7FA1C3 rounded-md focus:outline-none focus:ring-2 focus:ring-6482AD"
            />
          </div>

          {questionType === 'SingleChoice' && (
            <div>
              <label htmlFor="options" className="block text-lg font-medium text-7FA1C3">Options (Comma-separated):</label>
              <input
                type="text"
                id="options"
                value={options}
                onChange={handleOptionsChange}
                required
                className="w-full p-2 border border-7FA1C3 rounded-md focus:outline-none focus:ring-2 focus:ring-6482AD"
              />
              <label htmlFor="correctAnswer" className="block text-lg font-medium text-7FA1C3">Correct Answer:</label>
              <input
                type="text"
                id="correctAnswer"
                onChange={(e) => setCorrectAnswer(e.target.value)}
                required
                className="w-full p-2 border border-7FA1C3 rounded-md focus:outline-none focus:ring-2 focus:ring-6482AD"
              />
            </div>
          )}

          {questionType === 'MultipleChoice' && (
            <div>
              <label htmlFor="options" className="block text-lg font-medium text-7FA1C3">Options (Comma-separated):</label>
              <input
                type="text"
                id="options"
                value={options}
                onChange={(handleOptionsChange)}
                required
                className="w-full p-2 border border-7FA1C3 rounded-md focus:outline-none focus:ring-2 focus:ring-6482AD"
              />
              <label htmlFor="correctAnswers" className="block text-lg font-medium text-7FA1C3">Correct Answers (Comma-separated):</label>
              <input
                type="text"
                id="correctAnswers"
                value={correctAnswers}
                onChange={(e) => setCorrectAnswers(e.target.value)}
                required
                className="w-full p-2 border border-7FA1C3 rounded-md focus:outline-none focus:ring-2 focus:ring-6482AD"
              />
            </div>
          )}

          {questionType === 'Essay' && (
            <div>
              <label htmlFor="wordLimit" className="block text-lg font-medium text-7FA1C3">Word Limit:</label>
              <input
                type="number"
                id="wordLimit"
                required
                onChange={(e) => setWordLimit(e.target.value)}
                className="w-full p-2 border border-7FA1C3 rounded-md focus:outline-none focus:ring-2 focus:ring-6482AD"
              />
              <label htmlFor="wordLimit" className="block text-lg font-medium text-7FA1C3">Answer:</label>
              <textarea
                id="wordLimit"
                required
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full p-2 border border-7FA1C3 rounded-md focus:outline-none focus:ring-2 focus:ring-6482AD"
                rows="10"
              ></textarea>

            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-6482AD text-white py-2 rounded-md hover:bg-7FA1C3 focus:outline-none focus:ring-2 focus:ring-7FA1C3"
        >
          Submit
        </button>

        <Link to={`/question/${id}`}>
          <button
            className="w-full bg-6482AD text-white py-2 mt-2 rounded-md hover:bg-7FA1C3 focus:outline-none focus:ring-2 focus:ring-7FA1C3"
          >
            Back
          </button>
        </Link>
      </form>
    </div>
  )
}

export default CreateQuestion
