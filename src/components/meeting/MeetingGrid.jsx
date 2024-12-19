import React from 'react';
import { FiTrash2 } from 'react-icons/fi';  // Only import the Trash icon
import { RiCalendarScheduleFill } from 'react-icons/ri';  // Only import the Schedule icon

const MeetingGrid = ({ meetings, onSchedule, onDelete }) => {
  return (
    <div className="meeting-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {meetings.map((meeting, index) => {
        const date = meeting.datetime.split('T')[0];  // Extract date part
        const time = meeting.datetime.split('T')[1];  // Extract time part

        return (
          <div
            key={index}
            className="meeting-item p-4 border rounded shadow mb-4 relative group"
          >
            <h2 className="font-semibold">{meeting.title}</h2>
            <p className="text-sm">Agenda: {meeting.agenda}</p>
            <p className="text-sm">Date: {date}</p>
            <p className="text-sm">Time: {time}</p>
            <p className="text-sm">Participants: {meeting.persons.join(', ')}</p>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Schedule Button */}
              <button
                onClick={() => onSchedule(meeting)}
                className="p-2 bg-green-500 text-white rounded-full mr-2"
                aria-label={`Schedule meeting ${meeting.title}`}
              >
                <RiCalendarScheduleFill className="w-6 h-6" />
              </button>

              {/* Delete Button */}
              <button
                onClick={() => onDelete(meeting.id)}
                className="p-2 bg-red-500 text-white rounded-full"
                aria-label={`Delete meeting ${meeting.title}`}
              >
                <FiTrash2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MeetingGrid;
