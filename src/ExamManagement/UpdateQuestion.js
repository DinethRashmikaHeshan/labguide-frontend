import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function UpdateQuestion() {
    const { id, questionID } = useParams();
    const [question, setQuestion] = useState(null);
    const [formData, setFormData] = useState({
        answer: '',
        wordLimit: '',
        options: [''],
        correctAnswers: [''],
        correctAnswer: ''
    });

    useEffect(() => {
        getQuestion();
    }, []);

    const getQuestion = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/exam/exam/${id}/question/${questionID}`);
            setQuestion(res.data.question);
            setFormData({
                answer: res.data.question.answer || '',
                wordLimit: res.data.question.wordLimit || '',
                options: res.data.question.options || [],
                correctAnswers: res.data.question.correctAnswers || [],
                correctAnswer: res.data.question.correctAnswer || ''
            });
        } catch (error) {
            alert('Error: ' + (error.response?.data || error.message));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOptionsChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const handleCorrectAnswersChange = (index, value) => {
        const newCorrectAnswers = [...formData.correctAnswers];
        newCorrectAnswers[index] = value;
        setFormData({ ...formData, correctAnswers: newCorrectAnswers });
    };

    const handleSubmit = async () => {
        try {
            await axios.put(`http://localhost:3000/exam/exam/${id}/question/${questionID}`, formData);
            alert('Question updated successfully!');
            console.log(formData)
        } catch (error) {
            alert('Error: ' + (error.response?.data || error.message));
        }
    };

    if (!question) {
        return <div className="text-center text-lg font-medium">Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-8 bg-F5EDED shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-6 text-6482AD">Update Question</h2>
            <p className="text-lg mb-4">Question Type: <span className="font-medium">{question.questionType}</span></p>

            {/* Conditionally render based on questionType */}
            {question.questionType === 'EssayQuestion' && (
                <div className="mb-6">
                    <label className="block text-lg font-medium text-7FA1C3">Answer:</label>
                    <textarea
                        name="answer"
                        value={formData.answer}
                        onChange={handleChange}
                        className="w-full p-2 border border-7FA1C3 rounded-md bg-E2DAD6 focus:outline-none focus:ring-2 focus:ring-6482AD"
                    />

                    <label className="block text-lg font-medium text-7FA1C3 mt-4">Word Limit:</label>
                    <input
                        type="number"
                        name="wordLimit"
                        value={formData.wordLimit}
                        onChange={handleChange}
                        className="w-full p-2 border border-7FA1C3 rounded-md bg-E2DAD6 focus:outline-none focus:ring-2 focus:ring-6482AD"
                    />
                </div>
            )}

            {question.questionType === 'MultiChoiceQuestion' && (
                <div className="mb-6">
                    <label className="block text-lg font-medium text-7FA1C3">Options:</label>
                    {formData.options.map((option, index) => (
                        <input
                            key={index}
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionsChange(index, e.target.value)}
                            className="w-full mb-2 p-2 border border-7FA1C3 rounded-md bg-E2DAD6 focus:outline-none focus:ring-2 focus:ring-6482AD"
                        />
                    ))}

                    <label className="block text-lg font-medium text-7FA1C3 mt-4">Correct Answers:</label>
                    {formData.correctAnswers.map((answer, index) => (
                        <input
                            key={index}
                            type="text"
                            value={answer}
                            onChange={(e) => handleCorrectAnswersChange(index, e.target.value)}
                            className="w-full mb-2 p-2 border border-7FA1C3 rounded-md bg-E2DAD6 focus:outline-none focus:ring-2 focus:ring-6482AD"
                        />
                    ))}
                </div>
            )}

            {question.questionType === 'SingleChoiceQuestion' && (
                <div className="mb-6">
                    <label className="block text-lg font-medium text-7FA1C3">Options:</label>
                    {formData.options.map((option, index) => (
                        <input
                            key={index}
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionsChange(index, e.target.value)}
                            className="w-full mb-2 p-2 border border-7FA1C3 rounded-md bg-E2DAD6 focus:outline-none focus:ring-2 focus:ring-6482AD"
                        />
                    ))}

                    <label className="block text-lg font-medium text-7FA1C3 mt-4">Correct Answer:</label>
                    <input
                        type="text"
                        name="correctAnswer"
                        value={formData.correctAnswer}
                        onChange={handleChange}
                        className="w-full p-2 border border-7FA1C3 rounded-md bg-E2DAD6 focus:outline-none focus:ring-2 focus:ring-6482AD"
                    />
                </div>
            )}

            <button
                onClick={handleSubmit}
                className="w-full bg-6482AD text-white py-2 px-4 rounded-md hover:bg-7FA1C3 transition duration-300 focus:outline-none focus:ring-2 focus:ring-7FA1C3"
            >
                Update Question
            </button>
        </div>
    );
}

export default UpdateQuestion;