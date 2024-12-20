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
    meetingdatetime: '',
    persons: [],
  });
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3000/meetings')
      .then((response) => {
        setMeetings(response.data);
      })
      .catch((error) => console.error('Error fetching meetings:', error));
  }, []);

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

  const validateForm = () => {
    const newErrors = {};
    if (!newMeeting.title.trim()) newErrors.title = 'Title is required';
    if (!newMeeting.agenda.trim()) newErrors.agenda = 'Agenda is required';
    if (!newMeeting.meetingdatetime.trim()) newErrors.meetingdatetime = 'Date and Time are required';
    if (!newMeeting.persons.length) newErrors.persons = 'At least one participant is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editingMeeting) {
      axios
        .put(`http://localhost:3000/meetings/${editingMeeting.id}`, {
          ...newMeeting,
          id: editingMeeting.id,
        })
        .then((response) => {
          setMeetings((prevMeetings) =>
            prevMeetings.map((meeting) =>
              meeting.id === editingMeeting.id ? { ...meeting, ...newMeeting } : meeting
            )
          );
          setIsFormOpen(false);
          setEditingMeeting(null);
          setSuccessMessage('Meeting updated successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
        })
        .catch((error) => {
          setSuccessMessage('Failed to update meeting');
          setTimeout(() => setSuccessMessage(''), 3000);
        });
    } else {
      axios
        .post('http://localhost:3000/meetings', newMeeting)
        .then((response) => {
          setMeetings((prevMeetings) => [...prevMeetings, response.data]);
          setIsFormOpen(false);
          setSuccessMessage('Meeting created successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
        })
        .catch((error) => {
          setSuccessMessage('Failed to create meeting');
          setTimeout(() => setSuccessMessage(''), 3000);
        });
    }
  };

  const handleEdit = (meeting) => {
    const formattedDateTime = new Date(meeting.meetingdatetime).toISOString().slice(0, 16);
    setNewMeeting({
      ...meeting,
      meetingdatetime: formattedDateTime,
    });
    setEditingMeeting(meeting);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/meetings/${id}`)
      .then(() => {
        setMeetings((prevMeetings) => prevMeetings.filter((meeting) => meeting.id !== id));
        setSuccessMessage('Meeting deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch((error) => {
        setSuccessMessage('Failed to delete meeting');
        setTimeout(() => setSuccessMessage(''), 3000);
      });
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingMeeting(null);
    setNewMeeting({
      title: '',
      agenda: '',
      meetingdatetime: '',
      persons: [],
    });
    setErrors({});
  };

  const toggleForm = () => {
    if (isFormOpen) {
      handleCancel();
    } else {
      setNewMeeting({
        title: '',
        agenda: '',
        meetingdatetime: '',
        persons: [],
      });
      setIsFormOpen(true);
    }
  };

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
      {successMessage && (
  <div className="p-3 mb-4 text-green-500 bg-green-100 rounded inline-block">
    {successMessage}
  </div>
)}


      {/* Modal for form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="font-semibold">{editingMeeting ? 'Edit Meeting' : 'New Meeting'}</h2>
            <input
              type="text"
              name="title"
              placeholder="Title"
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
              name="meetingdatetime"
              value={newMeeting.meetingdatetime}
              onChange={handleFormChange}
              className="w-full p-2 border rounded mb-2"
            />
            {errors.meetingdatetime && <p className="text-red-500 text-sm">{errors.meetingdatetime}</p>}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <p>Participent's : </p><br />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="HR"
                  checked={newMeeting.persons.includes('HR')}
                  onChange={handleCheckboxChange}
                />
                <span>HR</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="cpc"
                  checked={newMeeting.persons.includes('cpc')}
                  onChange={handleCheckboxChange}
                />
                <span>CPC</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="md"
                  checked={newMeeting.persons.includes('md')}
                  onChange={handleCheckboxChange}
                />
                <span>MD</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="chairman"
                  checked={newMeeting.persons.includes('chairman')}
                  onChange={handleCheckboxChange}
                />
                <span>Chairman</span>
              </label>
            </div>
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
