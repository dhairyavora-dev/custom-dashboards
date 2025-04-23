
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockSystemDashboards, mockCustomDashboards } from '@/data/mockDashboards';
import { Dashboard, Chart, SaveChartOptions } from '@/types/dashboard';

export type ViewType = 'dashboard' | 'insightGenerator';

interface DashboardContextProps {
  systemDashboards: Dashboard[];
  customDashboards: Dashboard[];
  filteredDashboards: Dashboard[];
  currentDashboard: Dashboard | null;
  currentView: ViewType;
  searchQuery: string;
  setCurrentDashboard: (dashboard: Dashboard) => void;
  setCurrentView: (view: ViewType) => void;
  setSearchQuery: (query: string) => void;
  createDashboard: (name: string) => Dashboard;
  renameDashboard: (id: string, name: string) => void;
  deleteDashboard: (id: string) => void;
  togglePinDashboard: (id: string) => void;
  saveChart: (chart: Chart, options: SaveChartOptions) => void;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [systemDashboards, setSystemDashboards] = useState<Dashboard[]>(mockSystemDashboards);
  const [customDashboards, setCustomDashboards] = useState<Dashboard[]>(mockCustomDashboards);
  const [currentDashboard, setCurrentDashboard] = useState<Dashboard | null>(mockSystemDashboards[0]);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort dashboards: Pinned first, then alphabetically
  const filteredDashboards = React.useMemo(() => {
    const filtered = customDashboards.filter(dashboard => 
      dashboard.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Sort: Pinned first, then alphabetically
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [customDashboards, searchQuery]);

  const createDashboard = (name: string): Dashboard => {
    const newDashboard: Dashboard = {
      id: `dashboard-${Date.now()}`,
      name,
      type: 'custom',
      charts: [],
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setCustomDashboards(prev => [...prev, newDashboard]);
    setCurrentDashboard(newDashboard);
    setCurrentView('dashboard');
    return newDashboard;
  };

  const renameDashboard = (id: string, name: string) => {
    setCustomDashboards(prev => 
      prev.map(dashboard => 
        dashboard.id === id ? { ...dashboard, name, updatedAt: new Date() } : dashboard
      )
    );
  };

  const deleteDashboard = (id: string) => {
    setCustomDashboards(prev => prev.filter(dashboard => dashboard.id !== id));
    
    // If the current dashboard is deleted, set the first system dashboard as current
    if (currentDashboard?.id === id) {
      setCurrentDashboard(systemDashboards[0]);
    }
  };

  const togglePinDashboard = (id: string) => {
    setCustomDashboards(prev => 
      prev.map(dashboard => 
        dashboard.id === id 
          ? { ...dashboard, isPinned: !dashboard.isPinned, updatedAt: new Date() } 
          : dashboard
      )
    );
  };

  const saveChart = (chart: Chart, options: SaveChartOptions) => {
    const { saveType, dashboardId, newDashboardName } = options;
    
    if (saveType === 'saveAndPin') {
      if (dashboardId) {
        // Add chart to existing dashboard
        setCustomDashboards(prev => 
          prev.map(dashboard => 
            dashboard.id === dashboardId 
              ? { 
                  ...dashboard, 
                  charts: [...dashboard.charts, { ...chart, id: `chart-${Date.now()}` }],
                  updatedAt: new Date()
                } 
              : dashboard
          )
        );
      } else if (newDashboardName) {
        // Create new dashboard and add chart
        const newDashboard: Dashboard = {
          id: `dashboard-${Date.now()}`,
          name: newDashboardName,
          type: 'custom',
          charts: [{ ...chart, id: `chart-${Date.now()}` }],
          isPinned: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        setCustomDashboards(prev => [...prev, newDashboard]);
        setCurrentDashboard(newDashboard);
        setCurrentView('dashboard');
      }
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        systemDashboards,
        customDashboards,
        filteredDashboards,
        currentDashboard,
        currentView,
        searchQuery,
        setCurrentDashboard,
        setCurrentView,
        setSearchQuery,
        createDashboard,
        renameDashboard,
        deleteDashboard,
        togglePinDashboard,
        saveChart
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
