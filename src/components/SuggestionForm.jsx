import React, { useState } from 'react';
import axios from 'axios';

const SuggestionForm = () => {
    const [errorType, setErrorType] = useState('');
    const [category, setCategory] = useState('');
    const [supportiveLink, setSupportiveLink] = useState('');
    const [errorScenarios, setErrorScenarios] = useState([]);

    // Error scenarios to select from
    const scenarios = [
        { type: 'Error', categories: [
            'Array index out of bounds',
            'Dereferencing null pointer',
            'Memory leak',
            'Division by zero',
            'Double free',
            'Modifying const variable',
            'Buffer overflow',
            'Use of uninitialized pointer',
            'Unreachable code',
            'Resource leak',
            'Invalid pointer access',
            'Use after free'
        ]},
        { type: 'Warning', categories: [
            'Uninitialized variable',
            'Suspicious usage of sizeof',
            'Implicit conversion loss of precision',
            'Missing return statement',
            'Unused parameter',
            'Unused function',
            'Redundant condition',
            'Suspicious comparison'
        ]},
        { type: 'Style', categories: [
            'Variable shadowing',
            'Unnecessary pointer dereference',
            'Redundant code',
            'Unreachable break statement',
            'Redundant return statement'
        ]},
        { type: 'Performance', categories: [
            'Inefficient container use',
            'Unnecessary heap allocation',
            'Redundant function call',
            'Unnecessary copying of variable'
        ]},
        { type: 'Portability', categories: [
            '64-bit portability issue',
            'Usage of deprecated function',
            'Non-portable pointer size',
            'Endianness issue'
        ]},
        { type: 'Information', categories: [
            'Template recursion limit reached',
            'Inconclusive analysis',
            'Configuration problem',
            'Possible template instantiation overflow'
        ]}
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/errorSuggestions', {
                errorType,
                category,
                supportiveLink
            });
            resetForm();
        } catch (error) {
            console.error("Error submitting suggestion:", error);
            // Optional: Handle the error (e.g., show a notification)
        }
    };

    const resetForm = () => {
        setErrorType('');
        setCategory('');
        setSupportiveLink('');
        setErrorScenarios([]);
    };

    const handleTypeChange = (e) => {
        setErrorType(e.target.value);
        const selectedScenario = scenarios.find(scenario => scenario.type === e.target.value);
        setErrorScenarios(selectedScenario ? selectedScenario.categories : []);
        setCategory(''); // Reset category when changing error type
    };

    return (
        <form
            style={{
                maxWidth: '600px',
                margin: '0 auto',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f9f9f9',
            }}
            onSubmit={handleSubmit}
        >
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Submit Error Suggestion</h2>
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="errorType" style={{ display: 'block', marginBottom: '5px' }}>Error Type:</label>
                <select
                    id="errorType"
                    value={errorType}
                    onChange={handleTypeChange}
                    required
                    style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '16px',
                    }}
                >
                    <option value="">Select Error Type</option>
                    <option value="Error">Error</option>
                    <option value="Warning">Warning</option>
                    <option value="Performance">Performance</option>
                    <option value="Portability">Portability</option>
                    <option value="Information">Information</option>
                </select>
            </div>
            {errorType && (
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="category" style={{ display: 'block', marginBottom: '5px' }}>Category:</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '16px',
                        }}
                    >
                        <option value="">Select Category</option>
                        {errorScenarios.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            )}
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="supportiveLink" style={{ display: 'block', marginBottom: '5px' }}>Supportive Link:</label>
                <input
                    type="url"
                    id="supportiveLink"
                    value={supportiveLink}
                    onChange={(e) => setSupportiveLink(e.target.value)}
                    placeholder="https://example.com"
                    required
                    style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '16px',
                    }}
                />
            </div>
            <button
                type="submit"
                className="submit-button"
                style={{
                    padding: '10px 15px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#007BFF',
                    color: '#fff',
                    fontSize: '16px',
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007BFF')}
            >
                Submit Suggestion
            </button>
        </form>
    );
};

export default SuggestionForm;
