import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteList from '../components/note/NoteList';
import NoteGrid from '../components/note/NoteGrid';
import { FiPlus, FiEdit, FiTrash2, FiSave, FiX } from 'react-icons/fi';

const NotesPage = ({ isGridView }) => {
  const [notes, setNotes] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', date: '', createdBy: '' });
  const [editingNote, setEditingNote] = useState(null);
  const [errors, setErrors] = useState({}); // To track form validation errors

  useEffect(() => {
    axios
      .get('/data/notes.json')
      .then((response) => {
        console.log('Fetched notes:', response.data);
        setNotes(response.data);
      })
      .catch((error) => console.error('Error fetching notes:', error));
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));

    // Clear errors for the field being edited
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newNote.title.trim()) newErrors.title = 'Title is required';
    if (!newNote.content.trim()) newErrors.content = 'Content is required';
    if (!newNote.date.trim()) newErrors.date = 'Date is required';
    if (!newNote.createdBy.trim()) newErrors.createdBy = 'Created By is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editingNote) {
      axios
        .put(`https://jsonplaceholder.typicode.com/posts/${editingNote.id}`, newNote)
        .then((response) => {
          console.log('Note updated:', response.data);
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
      axios
        .post('https://jsonplaceholder.typicode.com/posts', { ...newNote, id: Date.now() })
        .then((response) => {
          console.log('Note created:', response.data);
          setNotes((prevNotes) => [...prevNotes, response.data]);
          setIsFormOpen(false);
        })
        .catch((error) => console.error('Error creating note:', error));
    }
  };

  const handleEdit = (note) => {
    setNewNote(note);
    setEditingNote(note);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    axios
      .delete(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then(() => {
        console.log('Note deleted:', id);
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      })
      .catch((error) => console.error('Error deleting note:', error));
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingNote(null);
    setNewNote({ title: '', content: '', date: '', createdBy: '' });
    setErrors({});
  };

  const toggleForm = () => {
    if (isFormOpen) {
      handleCancel();
    } else {
      setNewNote({ title: '', content: '', date: new Date().toISOString().split('T')[0], createdBy: '' });
      setIsFormOpen(true);
    }
  };

  return (
    <div>
      <div className='flex justify-between mb-3'>
        <h1 className="text-xl font-bold">Take a Notes...</h1>
        <button
          onClick={toggleForm}
          className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          <FiPlus className="w-6 h-6" />
        </button>
      </div>

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
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

          <textarea
            name="content"
            placeholder="Content"
            value={newNote.content}
            onChange={handleFormChange}
            className="w-full p-2 border rounded mb-2"
          />
          {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}

          <input
            type="date"
            name="date"
            value={newNote.date}
            onChange={handleFormChange}
            className="w-full p-2 border rounded mb-2"
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}

          <input
            type="text"
            name="createdBy"
            placeholder="Created By"
            value={newNote.createdBy}
            onChange={handleFormChange}
            className="w-full p-2 border rounded mb-2"
          />
          {errors.createdBy && <p className="text-red-500 text-sm">{errors.createdBy}</p>}

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

      {isGridView ? (
        <NoteGrid notes={notes} onEdit={handleEdit} onDelete={handleDelete} />
      ) : (
        <NoteList notes={notes} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default NotesPage;
