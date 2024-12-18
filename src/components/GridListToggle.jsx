// GridListToggle.js
import React from 'react';
import { FiGrid, FiList } from 'react-icons/fi';

const GridListToggle = ({ isGridView, toggleView }) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        className={`p-2 ${isGridView ? 'text-blue-500' : ''}`}
        onClick={() => toggleView(true)}
      >
        <FiGrid />
      </button>
      <button
        className={`p-2 ${!isGridView ? 'text-blue-500' : ''}`}
        onClick={() => toggleView(false)}
      >
        <FiList />
      </button>
    </div>
  );
};

export default GridListToggle;
