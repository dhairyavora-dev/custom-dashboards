
import React from 'react';
import { DashboardProvider } from '@/contexts/DashboardContext';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';

const DashboardLayout: React.FC = () => {
  return (
    <DashboardProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <Dashboard />
      </div>
    </DashboardProvider>
  );
};

export default DashboardLayout;
