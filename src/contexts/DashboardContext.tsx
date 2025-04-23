
import React, { createContext, useContext, useState, useEffect } from 'react';
import { systemDashboards, customDashboards } from '@/data/mockDashboards';
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
  removeChart: (dashboardId: string, chartId: string) => void;
  toggleChartWidth: (dashboardId: string, chartId: string) => void;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [systemDashboardsState, setSystemDashboards] = useState<Dashboard[]>(systemDashboards);
  const [customDashboardsState, setCustomDashboards] = useState<Dashboard[]>(customDashboards);
  const [currentDashboard, setCurrentDashboard] = useState<Dashboard | null>(systemDashboards[0]);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort dashboards: Pinned first, then alphabetically
  const filteredDashboards = React.useMemo(() => {
    const filtered = customDashboardsState.filter(dashboard => 
      dashboard.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Sort: Pinned first, then alphabetically
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [customDashboardsState, searchQuery]);

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
      setCurrentDashboard(systemDashboardsState[0]);
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

  const removeChart = (dashboardId: string, chartId: string) => {
    // For system dashboards
    if (dashboardId.includes('system') || dashboardId.includes('home') || dashboardId.includes('behavior') || dashboardId.includes('revenue') || dashboardId.includes('raman')) {
      setSystemDashboards(prev => 
        prev.map(dashboard => 
          dashboard.id === dashboardId 
            ? { 
                ...dashboard, 
                charts: dashboard.charts.filter(chart => chart.id !== chartId),
                updatedAt: new Date()
              } 
            : dashboard
        )
      );
    }
    // For custom dashboards
    else {
      setCustomDashboards(prev => 
        prev.map(dashboard => 
          dashboard.id === dashboardId 
            ? { 
                ...dashboard, 
                charts: dashboard.charts.filter(chart => chart.id !== chartId),
                updatedAt: new Date()
              } 
            : dashboard
        )
      );
    }
  };

  const toggleChartWidth = (dashboardId: string, chartId: string) => {
    // For system dashboards
    if (dashboardId.includes('system') || dashboardId.includes('home') || dashboardId.includes('behavior') || dashboardId.includes('revenue') || dashboardId.includes('raman')) {
      setSystemDashboards(prev => 
        prev.map(dashboard => 
          dashboard.id === dashboardId 
            ? { 
                ...dashboard, 
                charts: dashboard.charts.map(chart => 
                  chart.id === chartId 
                    ? { ...chart, isFullWidth: !chart.isFullWidth }
                    : chart
                ),
                updatedAt: new Date()
              } 
            : dashboard
        )
      );
    }
    // For custom dashboards
    else {
      setCustomDashboards(prev => 
        prev.map(dashboard => 
          dashboard.id === dashboardId 
            ? { 
                ...dashboard, 
                charts: dashboard.charts.map(chart => 
                  chart.id === chartId 
                    ? { ...chart, isFullWidth: !chart.isFullWidth }
                    : chart
                ),
                updatedAt: new Date()
              } 
            : dashboard
        )
      );
    }
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
        systemDashboards: systemDashboardsState,
        customDashboards: customDashboardsState,
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
        saveChart,
        removeChart,
        toggleChartWidth
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
