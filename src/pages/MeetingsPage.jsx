import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MeetingGrid from '../components/meeting/MeetingGrid';
import MeetingList from '../components/meeting/MeetingList';
import { FiPlus, FiEdit, FiTrash2, FiSave, FiX } from 'react-icons/fi';

const MeetingsPage = ({ isGridView }) => {
  const [meetings, setMeetings] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    agenda: '',
    date: '',
    starttime: '',
    endtime: '',
    persons: [],
  });
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch meetings from the mock API (JSONPlaceholder)
  useEffect(() => {
    axios
      .get('./data/meetings.json')  // Use JSONPlaceholder posts as meetings
      .then((response) => {
        console.log('Meetings fetched:', response.data);
        setMeetings(response.data);
      })
      .catch((error) => console.error('Error fetching meetings:', error));
  }, []);

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewMeeting((prevMeeting) => ({
      ...prevMeeting,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    if (!newMeeting.title.trim()) newErrors.title = 'Title is required';
    if (!newMeeting.agenda.trim()) newErrors.agenda = 'Agenda is required';
    if (!newMeeting.date.trim()) newErrors.date = 'Date is required';
    if (!newMeeting.starttime.trim()) newErrors.starttime = 'Start time is required';
    if (!newMeeting.endtime.trim()) newErrors.endtime = 'End time is required';
    if (!newMeeting.persons.length) newErrors.persons = 'At least one participant is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save or update meeting (POST or PUT)
  const handleSave = () => {
    if (!validateForm()) return;

    if (editingMeeting) {
      axios
        .put(`https://jsonplaceholder.typicode.com/posts/${editingMeeting.id}`, {
          ...newMeeting,
          id: editingMeeting.id,  // Ensure the ID is included in the request
        })
        .then((response) => {
          console.log('Meeting updated:', response.data);
          setMeetings((prevMeetings) =>
            prevMeetings.map((meeting) =>
              meeting.id === editingMeeting.id ? { ...meeting, ...newMeeting } : meeting
            )
          );
          setIsFormOpen(false);
          setEditingMeeting(null);
        })
        .catch((error) => console.error('Error updating meeting:', error));
    } else {
      axios
        .post('https://jsonplaceholder.typicode.com/posts', newMeeting)
        .then((response) => {
          console.log('New meeting created:', response.data);
          setMeetings((prevMeetings) => [...prevMeetings, response.data]);
          setIsFormOpen(false);
        })
        .catch((error) => console.error('Error creating meeting:', error));
    }
  };

  // Edit meeting
  const handleEdit = (meeting) => {
    setNewMeeting(meeting);
    setEditingMeeting(meeting);
    setIsFormOpen(true);
  };

  // Delete meeting
  const handleDelete = (id) => {
    axios
      .delete(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then(() => {
        console.log('Meeting deleted');
        setMeetings((prevMeetings) => prevMeetings.filter((meeting) => meeting.id !== id));
      })
      .catch((error) => console.error('Error deleting meeting:', error));
  };

  // Cancel editing or adding
  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingMeeting(null);
    setNewMeeting({
      title: '',
      agenda: '',
      date: '',
      starttime: '',
      endtime: '',
      persons: [],
    });
    setErrors({});
  };

  // Toggle form visibility
  const toggleForm = () => {
    if (isFormOpen) {
      handleCancel();
    } else {
      setNewMeeting({
        title: '',
        agenda: '',
        date: new Date().toISOString().split('T')[0],
        starttime: '',
        endtime: '',
        persons: [],
      });
      setIsFormOpen(true);
    }
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
            type="date"
            name="date"
            value={newMeeting.date}
            onChange={handleFormChange}
            className="w-full p-2 border rounded mb-2"
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}

          <input
            type="time"
            name="starttime"
            value={newMeeting.starttime}
            onChange={handleFormChange}
            className="w-full p-2 border rounded mb-2"
          />
          {errors.starttime && <p className="text-red-500 text-sm">{errors.starttime}</p>}

          <input
            type="time"
            name="endtime"
            value={newMeeting.endtime}
            onChange={handleFormChange}
            className="w-full p-2 border rounded mb-2"
          />
          {errors.endtime && <p className="text-red-500 text-sm">{errors.endtime}</p>}

          <input
            type="text"
            name="persons"
            placeholder="Participants (comma separated)"
            value={newMeeting.persons.join(', ')}
            onChange={(e) => handleFormChange({ target: { name: 'persons', value: e.target.value.split(',').map(str => str.trim()) } })}
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
              onClick={handleCancel}
              className="p-3 bg-gray-500 text-white rounded-full hover:bg-gray-600"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {isGridView ? (
        <MeetingGrid meetings={meetings} onEdit={handleEdit} onDelete={handleDelete} />
      ) : (
        <MeetingList meetings={meetings} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default MeetingsPage;
