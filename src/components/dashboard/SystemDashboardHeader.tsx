
import React from 'react';
import { Dashboard } from '@/types/dashboard';

interface SystemDashboardHeaderProps {
  dashboard: Dashboard;
}

const SystemDashboardHeader: React.FC<SystemDashboardHeaderProps> = ({
  dashboard,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">{dashboard.name}</h1>
        <p className="text-sm text-muted-foreground">
          Sample dashboard with analysis examples
        </p>
      </div>
      {/* No buttons for system dashboards */}
    </div>
  );
};

export default SystemDashboardHeader;
