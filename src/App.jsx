import React, { useState } from 'react';
import './index.css';
import GlobalRoutes from './Routes/GlobalRoutes'; // Make sure it uses the updated GlobalRoutes
// import Layout from './layout/Layout'; // Import Layout here

const App = () => {
  const [isGridView, setIsGridView] = useState(true); // State to control grid/list toggle

  const handleViewToggle = () => {
    setIsGridView(!isGridView); // Toggle between grid and list view
  };

  return (
    <div>
      {/* Removed Header here, as it will now be rendered inside Layout */}
      <GlobalRoutes isGridView={isGridView} handleViewToggle={handleViewToggle} />
    </div>
  );
};

export default App;
