import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../layout/Layout'; // Import Layout
import DashboardPage from '../pages/Dashboard';
import NotesPage from '../pages/NotesPage';
import MeetingsPage from '../pages/MeetingsPage';
import BinPage from '../pages/BinPage';

const GlobalRoutes = ({ isGridView, handleViewToggle }) => {
  return (
    <Router>
      <Routes>
        {/* Pass isGridView to Layout component */}
        <Route path="/" element={<Layout isGridView={isGridView} handleViewToggle={handleViewToggle} />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="notes" element={<NotesPage isGridView={isGridView} />} />
          <Route path="meetings" element={<MeetingsPage isGridView={isGridView} />} />
          <Route path="bin" element={<BinPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default GlobalRoutes;
