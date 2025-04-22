
import React from 'react';
import { Dashboard } from '@/types/dashboard';

interface SystemDashboardHeaderProps {
  dashboard: Dashboard;
  onSaveChart: (type: 'chart' | 'table') => void;
}

const SystemDashboardHeader: React.FC<SystemDashboardHeaderProps> = ({
  dashboard,
  onSaveChart,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">{dashboard.name}</h1>
        <p className="text-sm text-muted-foreground">
          Sample dashboard with analysis examples
        </p>
      </div>
    </div>
  );
};

export default SystemDashboardHeader;
