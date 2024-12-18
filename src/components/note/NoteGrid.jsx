import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi'; // Edit and Delete icons

const NoteGrid = ({ notes, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {notes.map((note, index) => (
        <div
          key={index}
          className="note-item p-4 border rounded shadow relative group"
        >
          <h2 className="font-semibold">{note.title}</h2>
          <p className="text-sm">{note.content}</p>
          <div className="text-xs text-gray-500">
            <p>Date: {note.date}</p>
            <p>Created by: {note.createdBy}</p>
          </div>
          
          {/* Edit and Delete Icons - Only visible on hover */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(note)}
              className="p-2 bg-yellow-500 text-white rounded-full mr-2"
            >
              <FiEdit className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="p-2 bg-red-500 text-white rounded-full"
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteGrid;
