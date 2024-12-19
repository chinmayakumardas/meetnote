import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MeetingGrid from '../components/meeting/MeetingGrid';
import MeetingList from '../components/meeting/MeetingList';
import { FiPlus, FiSave, FiX } from 'react-icons/fi';

const MeetingsPage = ({ isGridView }) => {
  const [meetings, setMeetings] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    agenda: '',
    datetime: '',
    persons: [],
  });
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get('./data/meetings.json')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setMeetings(response.data);
        } else {
          console.error('Unexpected data format:', response.data);
          setMeetings([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching meetings:', error);
        setMeetings([]); // Ensure the state is an empty array on error
      });
  }, []);
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewMeeting((prevMeeting) => ({
      ...prevMeeting,
      [name]: name === 'persons' ? value.split(',').map((person) => person.trim()) : value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newMeeting.title.trim()) newErrors.title = 'Title is required';
    if (!newMeeting.agenda.trim()) newErrors.agenda = 'Agenda is required';
    if (!newMeeting.datetime.trim()) newErrors.datetime = 'Date and time are required';
    if (!newMeeting.persons.length) newErrors.persons = 'At least one participant is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    if (editingMeeting) {
      setMeetings((prevMeetings) =>
        prevMeetings.map((meeting) =>
          meeting.id === editingMeeting.id ? { ...meeting, ...newMeeting } : meeting
        )
      );
      setEditingMeeting(null);
    } else {
      setMeetings((prevMeetings) => [
        ...prevMeetings,
        { ...newMeeting, id: Date.now() }, // Simulate unique ID
      ]);
    }
    setIsFormOpen(false);
    resetForm();
  };

  const handleEdit = (meeting) => {
    setNewMeeting(meeting);
    setEditingMeeting(meeting);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    setMeetings((prevMeetings) => prevMeetings.filter((meeting) => meeting.id !== id));
  };

  const resetForm = () => {
    setNewMeeting({ title: '', agenda: '', datetime: '', persons: [] });
    setErrors({});
  };

  const toggleForm = () => {
    if (isFormOpen) resetForm();
    setIsFormOpen(!isFormOpen);
  };

  return (
    <div>
      <div className="flex justify-between mb-3">
        <h1 className="text-xl font-bold">Meeting Scheduler</h1>
        <button
          onClick={toggleForm}
          className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          <FiPlus className="w-6 h-6" />
        </button>
      </div>

      {isFormOpen && (
        <div className="p-4 border rounded shadow mb-4">
          <h2 className="font-semibold">{editingMeeting ? 'Edit Meeting' : 'New Meeting'}</h2>
          <input
            type="text"
            name="title"
            placeholder="Meeting Title"
            value={newMeeting.title}
            onChange={handleFormChange}
            className="w-full p-2 border rounded mb-2"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

          <textarea
            name="agenda"
            placeholder="Agenda"
            value={newMeeting.agenda}
            onChange={handleFormChange}
            className="w-full p-2 border rounded mb-2"
          />
          {errors.agenda && <p className="text-red-500 text-sm">{errors.agenda}</p>}

          <input
            type="datetime-local"
            name="datetime"
            value={newMeeting.datetime}
            onChange={handleFormChange}
            className="w-full p-2 border rounded mb-2"
          />
          {errors.datetime && <p className="text-red-500 text-sm">{errors.datetime}</p>}

          <input
            type="text"
            name="persons"
            placeholder="Participants (comma separated)"
            value={newMeeting.persons.join(', ')}
            onChange={handleFormChange}
            className="w-full p-2 border rounded mb-2"
          />
          {errors.persons && <p className="text-red-500 text-sm">{errors.persons}</p>}

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleSave}
              className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600"
            >
              <FiSave className="w-6 h-6" />
            </button>
            <button
              onClick={toggleForm}
              className="p-3 bg-gray-500 text-white rounded-full hover:bg-gray-600"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {isGridView ? (
        <MeetingGrid meetings={meetings} onSchedule={handleEdit} onDelete={handleDelete} />
      ) : (
        <MeetingList meetings={meetings} onSchedule={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default MeetingsPage;
