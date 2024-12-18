import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteList from '../components/note/NoteList'; // List view component
import NoteGrid from '../components/note/NoteGrid'; // Grid view component
import { FiPlus, FiEdit, FiTrash2, FiSave, FiX } from 'react-icons/fi'; // Icons for create, edit, delete, save, and cancel

const NotesPage = ({ isGridView }) => {
  const [notes, setNotes] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', date: '', createdBy: '' });
  const [editingNote, setEditingNote] = useState(null);

  // Fetch notes from API or static data
  useEffect(() => {
    axios
      .get('/data/notes.json') // Adjust API path as necessary
      .then((response) => {
        setNotes(response.data); // Set notes to state
      })
      .catch((error) => console.error('Error fetching notes:', error));
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Validation for required fields
    if (!newNote.title || !newNote.content || !newNote.date || !newNote.createdBy) {
      alert('All fields are required');
      return;
    }

    // Check if the date is in proper YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(newNote.date)) {
      alert('Please enter a valid date in YYYY-MM-DD format');
      return;
    }

    if (editingNote) {
      // If editing an existing note, make a PUT request to update it
      axios
        .put(`/api/notes/${editingNote.id}`, newNote)
        .then((response) => {
          setNotes((prevNotes) =>
            prevNotes.map((note) =>
              note.id === editingNote.id ? { ...note, ...newNote } : note
            )
          );
          setIsFormOpen(false);
          setEditingNote(null);
        })
        .catch((error) => console.error('Error updating note:', error));
    } else {
      // If creating a new note, make a POST request
      axios
        .post('https://jsonplaceholder.typicode.com/todos', newNote)
        .then((response) => {
          setNotes((prevNotes) => [...prevNotes, response.data]);
          console.log("Note created successfully:", response.data);
          setIsFormOpen(false);
        })
        .catch((error) => console.error('Error creating note:', error));
    }
  };

  const handleEdit = (note) => {
    setNewNote(note); // Pre-fill form with the existing note's data
    setEditingNote(note); // Set editing state to true
    setIsFormOpen(true); // Open the form
  };

  const handleDelete = (id) => {
    // Delete the note
    axios
      .delete(`/api/notes/${id}`)
      .then((response) => {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      })
      .catch((error) => console.error('Error deleting note:', error));
  };

  const handleCancel = () => {
    setIsFormOpen(false); // Close form without saving changes
    setEditingNote(null); // Reset editing state
    setNewNote({ title: '', content: '', date: '', createdBy: '' }); // Reset form data
  };

  return (
    <div>
      <h1 className="text-xl font-bold">Notes</h1>
      
      {/* Create New Note Button */}
      <button
        onClick={() => {
          setIsFormOpen(true);
          setEditingNote(null); // Clear the editing state for new note
        }}
        className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
      >
        <FiPlus className="w-6 h-6" />
      </button>

      {/* Notes Form */}
      {isFormOpen && (
        <div className="p-4 border rounded shadow mb-4">
          <h2 className="font-semibold">{editingNote ? 'Edit Note' : 'New Note'}</h2>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newNote.title}
            onChange={handleFormChange}
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            name="content"
            placeholder="Content"
            value={newNote.content}
            onChange={handleFormChange}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="date"
            name="date"
            value={newNote.date}
            onChange={handleFormChange}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            name="createdBy"
            placeholder="Created By"
            value={newNote.createdBy}
            onChange={handleFormChange}
            className="w-full p-2 border rounded mb-2"
          />
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleSave}
              className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600"
            >
              <FiSave className="w-6 h-6" />
            </button>
            <button
              onClick={handleCancel}
              className="p-3 bg-gray-500 text-white rounded-full hover:bg-gray-600"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Render Notes */}
      {isGridView ? (
        <NoteGrid notes={notes} onEdit={handleEdit} onDelete={handleDelete} />
      ) : (
        <NoteList notes={notes} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default NotesPage;
