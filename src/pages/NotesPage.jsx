import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteList from '../components/note/NoteList';
import NoteGrid from '../components/note/NoteGrid';
import { FiPlus, FiSave, FiX } from 'react-icons/fi';

const NotesPage = ({ isGridView }) => {
  const [notes, setNotes] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', date: '', person: '' });
  const [editingNote, setEditingNote] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3000/notes')
      .then((response) => {
        // Sort the notes by date in descending order (latest first)
        const sortedNotes = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNotes(sortedNotes);
      })
      .catch((error) => console.error('Error fetching notes:', error));
  }, []);

  // Truncate the content to show a short version in the list
  const truncateContent = (content) => {
    if (content.length > 100) {
      return content.substring(0, 100) + '...';
    }
    return content;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
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
    if (!newNote.person.trim()) newErrors.person = 'Person is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editingNote) {
      axios
        .put(`http://localhost:3000/notes/${editingNote.id}`, newNote)
        .then(() => {
          setNotes((prevNotes) =>
            prevNotes.map((note) =>
              note.id === editingNote.id ? { ...note, ...newNote } : note
            )
          );
          setSuccessMessage('Note updated successfully!');
          setIsFormOpen(false);
          setEditingNote(null);
          setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
        })
        .catch((error) => console.error('Error updating note:', error));
    } else {
      axios
        .post('http://localhost:3000/notes', { ...newNote, id: Date.now() })
        .then((response) => {
          setNotes((prevNotes) => [response.data, ...prevNotes]); // Add new note at the beginning
          setSuccessMessage('Note created successfully!');
          setIsFormOpen(false);
          setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
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
      .delete(`http://localhost:3000/notes/${id}`)
      .then(() => {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
        setSuccessMessage('Note deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
      })
      .catch((error) => console.error('Error deleting note:', error));
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingNote(null);
    setNewNote({ title: '', content: '', date: '', person: '' });
    setErrors({});
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
    if (!isFormOpen) {
      setNewNote({ title: '', content: '', date: '', person: '' });
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-3">
        <h1 className="text-xl font-bold">Take Notes</h1>
        <button
          onClick={toggleForm}
          className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          <FiPlus className="w-6 h-6" />
        </button>
      </div>

      {successMessage && (
        <div className="p-3 text-green-500 bg-green-100 rounded inline-block">
          {successMessage}
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="font-semibold text-lg mb-4">{editingNote ? 'Edit Note' : 'New Note'}</h2>
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
            <select
              name="person"
              value={newNote.person}
              onChange={handleFormChange}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="">Select person</option>
              <option value="CPC">CPC</option>
              <option value="Chairman">Chairman</option>
              <option value="MD">MD</option>
            </select>
            {errors.person && <p className="text-red-500 text-sm">{errors.person}</p>}
            <div className="flex justify-end space-x-4 mt-4">
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
        </div>
      )}

      {isGridView ? (
        <NoteGrid notes={notes} onEdit={handleEdit} onDelete={handleDelete} truncateContent={truncateContent} />
      ) : (
        <NoteList notes={notes} onEdit={handleEdit} onDelete={handleDelete} truncateContent={truncateContent} />
      )}
    </div>
  );
};

export default NotesPage;
