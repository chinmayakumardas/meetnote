import React, { useState } from "react";
import { FiSearch, FiRefreshCw, FiGrid, FiList } from "react-icons/fi";

const Header = ({ onViewToggle, isGridView }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [rotateKey, setRotateKey] = useState(0); // Key to trigger re-render of the rotation

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    console.log("Search Query:", searchQuery);
  };

  const handleRefresh = () => {
    setIsLoading(true); // Set loading to true
    setRotateKey(prevKey => prevKey + 1); // Trigger the rotation animation
    setTimeout(() => {
      window.location.reload(); // Refresh the page after a brief delay
    }, 2000); // Delay of 2 seconds for the rotation animation to complete
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-100 shadow">
      <div className="flex items-center space-x-4 w-full">
        {/* Search Bar */}
        <div className="relative left-3 w-full sm:w-1/3 md:w-80 mx-4">
          <FiSearch className="absolute top-2.5 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh} // Handle page refresh
          className="p-2 bg-gray-200 rounded hover:bg-gray-300 relative"
        >
          <FiRefreshCw
            className={`transition-transform duration-1000 ease-in-out ${
              isLoading ? `animate-spin ${rotateKey % 2 === 0 ? '' : 'rotate-1080'}` : ''
            }`}
          />
        </button>
      </div>

      {/* Grid/List Toggle */}
      <button
        onClick={onViewToggle}
        className="p-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        {isGridView ? <FiList /> : <FiGrid />}
      </button>
    </header>
  );
};

export default Header;
