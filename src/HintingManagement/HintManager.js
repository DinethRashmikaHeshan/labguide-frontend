import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HintManager = () => {
  const [hints, setHints] = useState([]);
  const [newHintText, setNewHintText] = useState('');
  const [newErrorType, setNewErrorType] = useState('');
  const [editId, setEditId] = useState(null);
  const [editHintText, setEditHintText] = useState('');
  const [editErrorType, setEditErrorType] = useState('');

  useEffect(() => {
    fetchHints();
  }, []);

  const fetchHints = async () => {
    try {
      const response = await axios.get('http://localhost:3000/hint/hints');
      setHints(response.data);
    } catch (error) {
      console.error('Error fetching hints:', error);
    }
  };

  const createHint = async () => {
    try {
      const response = await axios.post('http://localhost:3000/hint/hints', {
        hintText: newHintText,
        errorType: newErrorType,
      });
      setHints([...hints, response.data]);
      setNewHintText('');
      setNewErrorType('');
    } catch (error) {
      console.error('Error creating hint:', error);
    }
  };

  const updateHint = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/hint/hints/${editId}`, {
        hintText: editHintText,
        errorType: editErrorType,
      });
      setHints(hints.map(hint => hint._id === editId ? response.data : hint));
      setEditId(null);
      setEditHintText('');
      setEditErrorType('');
    } catch (error) {
      console.error('Error updating hint:', error);
    }
  };

  const deleteHint = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/hint/hints/${id}`);
      setHints(hints.filter(hint => hint._id !== id));
    } catch (error) {
      console.error('Error deleting hint:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Hint Manager</h2>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Hint Text"
          className="form-control mb-2"
          value={newHintText}
          onChange={(e) => setNewHintText(e.target.value)}
        />
        <input
          type="text"
          placeholder="Error Type"
          className="form-control mb-2"
          value={newErrorType}
          onChange={(e) => setNewErrorType(e.target.value)}
        />
        <button className="btn btn-primary" onClick={createHint}>
          Add Hint
        </button>
      </div>

      <ul className="list-group">
        {hints.map((hint) => (
          <li key={hint._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{hint.errorType}:</strong> {hint.hintText}
            </div>
            <div>
              <button
                className="btn btn-secondary btn-sm me-2"
                onClick={() => {
                  setEditId(hint._id);
                  setEditHintText(hint.hintText);
                  setEditErrorType(hint.errorType);
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteHint(hint._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editId && (
        <div className="mt-4">
          <h4>Edit Hint</h4>
          <input
            type="text"
            placeholder="Hint Text"
            className="form-control mb-2"
            value={editHintText}
            onChange={(e) => setEditHintText(e.target.value)}
          />
          <input
            type="text"
            placeholder="Error Type"
            className="form-control mb-2"
            value={editErrorType}
            onChange={(e) => setEditErrorType(e.target.value)}
          />
          <button className="btn btn-primary" onClick={updateHint}>
            Update Hint
          </button>
          <button
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditId(null);
              setEditHintText('');
              setEditErrorType('');
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default HintManager;
