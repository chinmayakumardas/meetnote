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
      .get('./data/meetings.json') // Change with your real API URL
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
    if (!newMeeting.datetime.trim()) newErrors.datetime = 'Date and Time are required';
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
          id: editingMeeting.id,
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
    } 
    else {
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
    setNewMeeting({ ...meeting, datetime: `${meeting.date}T${meeting.starttime}` });
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
      datetime: '',
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
        datetime: '',
        persons: [],
      });
      setIsFormOpen(true);
    }
  };

  // Handle checkbox change for participants
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setNewMeeting((prevMeeting) => {
      const updatedPersons = checked
        ? [...prevMeeting.persons, value]
        : prevMeeting.persons.filter((person) => person !== value);
      return { ...prevMeeting, persons: updatedPersons };
    });
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
        <div className="p-4 border rounded shadow mb-4 w-80 mx-auto">
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

          {/* Participant checkboxes */}
          <div className="mb-4">
            <label className="font-semibold">Participants</label>
            <div className="grid grid-cols-2 gap-2">
              {['Chairman', 'MD', 'CPC', 'HR'].map((role) => (
                <div key={role} className="flex items-center">
                  <input
                    type="checkbox"
                    id={role}
                    value={role}
                    checked={newMeeting.persons.includes(role)}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label htmlFor={role} className="text-sm">{role}</label>
                </div>
              ))}
            </div>
            {errors.persons && <p className="text-red-500 text-sm">{errors.persons}</p>}
          </div>

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
        <MeetingGrid
          meetings={meetings}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSchedule={handleEdit}  // Schedule should trigger the edit functionality
        />
      ) : (
        <MeetingList
          meetings={meetings}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSchedule={handleEdit}  // Schedule should trigger the edit functionality
        />
      )}
    </div>
  );
};

export default MeetingsPage;
