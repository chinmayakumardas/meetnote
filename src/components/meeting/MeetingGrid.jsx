import React from 'react';
import { FiCheckCircle, FiX } from 'react-icons/fi';
import { RiCalendarScheduleFill } from "react-icons/ri";
const MeetingGrid = ({ meetings, onSchedule, onCancel }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {meetings.map((meeting, index) => (
        <div
          key={index}
          className="meeting-item p-4 border rounded shadow relative group"
        >
          <h2 className="font-semibold">{meeting.title}</h2>
          <p className="text-sm">Agenda: {meeting.agenda}</p>
          <p className="text-sm">Date: {meeting.date}</p>
          <p className="text-sm">Time: {meeting.starttime} - {meeting.endtime}</p>
          <p className="text-sm">Participants: {meeting.persons.join(', ')}</p>

          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onSchedule(meeting)}
              className="p-2 bg-green-500 text-white rounded-full mr-2"
            >
              <RiCalendarScheduleFill className="w-6 h-6" />
            </button>
            <button
              onClick={() => onCancel(meeting.id)}
              className="p-2 bg-red-500 text-white rounded-full"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MeetingGrid;
