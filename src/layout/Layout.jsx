import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = ({ isGridView, handleViewToggle }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header onViewToggle={handleViewToggle} isGridView={isGridView} />

        {/* Main Content (Dynamic Content based on routes) */}
        <div className="flex-1 overflow-y-auto p-4">
          <Outlet /> {/* This renders the content of the current route */}
        </div>
      </div>
    </div>
  );
};

export default Layout;
