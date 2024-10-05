import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const HintManager = () => {
  const [hints, setHints] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // For search functionality
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
      setIsAddModalOpen(false); // Close modal after adding
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
      setIsEditModalOpen(false); // Close modal after saving
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

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Set a dark background for the entire page
    doc.setFillColor(30, 30, 30); // Dark background (RGB values)
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, "F"); // Fill entire page
  
    // Heading Section Background
    doc.setFillColor(22, 160, 133); // Teal color for heading section
    doc.rect(0, 0, doc.internal.pageSize.width, 30, "F"); // Heading background rectangle
  
    // Set the app's name as the main heading with white text, bold, and larger font size
    doc.setFontSize(26); // Increase font size
    doc.setFont("helvetica", "bold"); // Set font to bold
    doc.setTextColor(255, 255, 255); // White text for the main heading
    doc.text("<LabGuide/>", 105, 18, null, null, "center");
  
    // Sub-heading: Set the report title
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255); // White text
    doc.text("Error Hints Report", 105, 28, null, null, "center");
  
    // Display the current PDF generation date in the top-left corner with white text
    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255); // White text
    doc.text(`Report generated on: ${currentDate}`, 10, 35);
  
    // Define a margin for the content
    let startY = 45;
  
    // Create table headers with teal background and white text
    const tableHeaders = [["Error Type", "Hint Text"]];
  
    // Map hint data to rows
    const tableData = hints.map((hint) => [
      hint.errorType,
      hint.hintText,
    ]);
  
    // Use jsPDF autotable for a clean table layout with matching theme
    doc.autoTable({
      head: tableHeaders,
      body: tableData,
      startY,
      theme: "grid", // Use a grid theme for better styling
      margin: { top: 40 },
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] }, // Teal background, white text
      bodyStyles: {
        valign: "middle",
        textColor: [255, 255, 255],
        fillColor: [50, 50, 50],
      }, // White text, dark grey row
      alternateRowStyles: { fillColor: [40, 40, 40] }, // Darker grey for alternate rows
      styles: { fillColor: [30, 30, 30], textColor: [255, 255, 255] }, // Dark grey background, white text for table
    });
  
    // Add a footer with white text and teal line
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
  
      // Draw a teal line at the footer
      doc.setDrawColor(22, 160, 133);
      doc.line(
        10,
        doc.internal.pageSize.height - 15,
        doc.internal.pageSize.width - 10,
        doc.internal.pageSize.height - 15
      );
  
      // Add footer text
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255); // White text
      doc.text(
        `Page ${i} of ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        null,
        null,
        "center"
      );
    }
  
    // Save the PDF
    doc.save("Hint_Report.pdf");
  };
  

  // Filter hints based on search input
  const filteredHints = hints.filter(hint =>
    hint.errorType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hint.hintText.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Search Input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search hints by error type or text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredHints.length === 0 ? (
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
            {filteredHints.map((hint) => (
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
          <div className="modal-dialog modal-dialog-centered"> {/* Centering modal */}
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
          <div className="modal-dialog modal-dialog-centered"> {/* Centering modal */}
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
          <div className="modal-dialog modal-dialog-centered"> {/* Centering modal */}
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" onClick={() => setIsDeleteModalOpen(false)}>&times;</button>
                <h4 className="modal-title">Delete Error Type</h4>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this hint?</p>
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
