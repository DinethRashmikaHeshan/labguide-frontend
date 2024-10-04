import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const HintManager = () => {
  const [hints, setHints] = useState([]);
  const [newHintText, setNewHintText] = useState('');
  const [newErrorType, setNewErrorType] = useState('');
  const [editId, setEditId] = useState(null);
  const [editHintText, setEditHintText] = useState('');
  const [editErrorType, setEditErrorType] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

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
      setHints(hints.map((hint) => (hint._id === editId ? response.data : hint)));
      setEditId(null);
      setEditHintText('');
      setEditErrorType('');
    } catch (error) {
      console.error('Error updating hint:', error);
    }
  };

  const deleteHint = async () => {
    try {
      await axios.delete(`http://localhost:3000/hint/hints/${selectedDeleteId}`);
      setHints(hints.filter(hint => hint._id !== selectedDeleteId));
      setSelectedDeleteId(null);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting hint:', error);
    }
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    const table = document.getElementById('hints-table');

    const canvas = await html2canvas(table);
    const imgData = canvas.toDataURL('image/png');
    
    doc.addImage(imgData, 'PNG', 10, 10, 180, 0);
    doc.save('hints-report.pdf');
  };

  return  (
    <div className="container mt-5">
      <div className="mb-3">
        <button className="btn btn-success" onClick={() => setIsAddModalOpen(true)}>
          Add New Error Type
        </button>
        <button className="btn btn-primary ms-3" onClick={generatePDF}>
          Generate Report
        </button>
      </div>

      {hints.length === 0 ? (
        <p>No hints available</p>
      ) : (
        <table id="hints-table" className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Error Type</th>
              <th>Hint Text</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hints.map((hint) => (
              <tr key={hint._id}>
                <td>{hint.errorType}</td>
                <td>{hint.hintText}</td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm me-2"
                    onClick={() => {
                      setEditId(hint._id);
                      setEditHintText(hint.hintText);
                      setEditErrorType(hint.errorType);
                      setIsEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      setSelectedDeleteId(hint._id);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Error Type Modal */}
      {isAddModalOpen && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
              <button type="button" className="close" onClick={() => setIsAddModalOpen(false)}>&times;</button>
                <h4 className="modal-title">Add Error Type</h4>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Error Type</label>
                  <input type="text" className="form-control" value={newErrorType} onChange={(e) => setNewErrorType(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Hint Text</label>
                  <textarea className="form-control" value={newHintText} onChange={(e) => setNewHintText(e.target.value)} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="button" className="btn btn-success" onClick={createHint}>Add</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Error Type Modal */}
      {isEditModalOpen && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" onClick={() => setIsEditModalOpen(false)}>&times;</button>
                <h4 className="modal-title">Edit Error Type</h4>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Error Type</label>
                  <input type="text" className="form-control" value={editErrorType} onChange={(e) => setEditErrorType(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Hint Text</label>
                  <textarea className="form-control" value={editHintText} onChange={(e) => setEditHintText(e.target.value)} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="button" className="btn btn-info" onClick={updateHint}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Error Type Modal */}
      {isDeleteModalOpen && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" onClick={() => setIsDeleteModalOpen(false)}>&times;</button>
                <h4 className="modal-title">Delete Error Type</h4>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this record?</p>
                <p className="text-warning"><small>This action cannot be undone.</small></p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={deleteHint}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default HintManager;
