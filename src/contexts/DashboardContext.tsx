
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Dashboard, Chart, SaveChartOptions } from '../types/dashboard';
import { customDashboards, systemDashboards } from '../data/mockDashboards';
import { toast } from '@/hooks/use-toast';

interface DashboardContextProps {
  systemDashboards: Dashboard[];
  customDashboards: Dashboard[];
  currentDashboard: Dashboard | null;
  setCurrentDashboard: (dashboard: Dashboard) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredDashboards: Dashboard[];
  togglePinDashboard: (dashboardId: string) => void;
  renameDashboard: (dashboardId: string, newName: string) => void;
  addChart: (dashboardId: string, chart: Chart) => void;
  removeChart: (dashboardId: string, chartId: string) => void;
  toggleChartWidth: (dashboardId: string, chartId: string) => void;
  saveChart: (chart: Chart, options: SaveChartOptions) => void;
  updateChartOrder: (dashboardId: string, reorderedCharts: Chart[]) => void;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allSystemDashboards, setSystemDashboards] = useState<Dashboard[]>(systemDashboards);
  const [allCustomDashboards, setCustomDashboards] = useState<Dashboard[]>(customDashboards);
  const [currentDashboard, setCurrentDashboard] = useState<Dashboard | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Set the default dashboard to the first system dashboard
    if (allSystemDashboards.length > 0 && !currentDashboard) {
      setCurrentDashboard(allSystemDashboards[0]);
    }
  }, [allSystemDashboards, currentDashboard]);

  // Filter dashboards based on search query
  const filteredDashboards = allCustomDashboards.filter(dashboard => 
    dashboard.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort filtered dashboards to put pinned ones at the top
  const sortedFilteredDashboards = [...filteredDashboards].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const togglePinDashboard = (dashboardId: string) => {
    setCustomDashboards(prevDashboards =>
      prevDashboards.map(dashboard =>
        dashboard.id === dashboardId
          ? { ...dashboard, isPinned: !dashboard.isPinned }
          : dashboard
      )
    );
    
    toast({
      title: "Dashboard Updated",
      description: "Pin status has been updated.",
    });
  };

  const renameDashboard = (dashboardId: string, newName: string) => {
    // Check if it's a custom or system dashboard
    const isCustom = allCustomDashboards.some(d => d.id === dashboardId);
    
    if (isCustom) {
      setCustomDashboards(prevDashboards =>
        prevDashboards.map(dashboard =>
          dashboard.id === dashboardId
            ? { ...dashboard, name: newName, updatedAt: new Date() }
            : dashboard
        )
      );
    } else {
      setSystemDashboards(prevDashboards =>
        prevDashboards.map(dashboard =>
          dashboard.id === dashboardId
            ? { ...dashboard, name: newName, updatedAt: new Date() }
            : dashboard
        )
      );
    }
    
    // Update current dashboard if it's the one being renamed
    if (currentDashboard && currentDashboard.id === dashboardId) {
      setCurrentDashboard({ ...currentDashboard, name: newName, updatedAt: new Date() });
    }
    
    toast({
      title: "Dashboard Renamed",
      description: `Dashboard has been renamed to "${newName}".`,
    });
  };

  const addChart = (dashboardId: string, chart: Chart) => {
    // Check if it's a custom or system dashboard
    const isCustom = allCustomDashboards.some(d => d.id === dashboardId);
    
    if (isCustom) {
      setCustomDashboards(prevDashboards =>
        prevDashboards.map(dashboard =>
          dashboard.id === dashboardId
            ? { 
                ...dashboard, 
                charts: [...dashboard.charts, chart],
                updatedAt: new Date()
              }
            : dashboard
        )
      );
    } else {
      setSystemDashboards(prevDashboards =>
        prevDashboards.map(dashboard =>
          dashboard.id === dashboardId
            ? { 
                ...dashboard, 
                charts: [...dashboard.charts, chart],
                updatedAt: new Date()
              }
            : dashboard
        )
      );
    }
    
    // Update current dashboard if it's the one being modified
    if (currentDashboard && currentDashboard.id === dashboardId) {
      setCurrentDashboard({
        ...currentDashboard,
        charts: [...currentDashboard.charts, chart],
        updatedAt: new Date()
      });
    }
    
    toast({
      title: "Chart Added",
      description: "New chart has been added to the dashboard.",
    });
  };

  const removeChart = (dashboardId: string, chartId: string) => {
    // Check if it's a custom or system dashboard
    const isCustom = allCustomDashboards.some(d => d.id === dashboardId);
    
    if (isCustom) {
      setCustomDashboards(prevDashboards =>
        prevDashboards.map(dashboard =>
          dashboard.id === dashboardId
            ? { 
                ...dashboard, 
                charts: dashboard.charts.filter(chart => chart.id !== chartId),
                updatedAt: new Date()
              }
            : dashboard
        )
      );
    } else {
      setSystemDashboards(prevDashboards =>
        prevDashboards.map(dashboard =>
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
    
    // Update current dashboard if it's the one being modified
    if (currentDashboard && currentDashboard.id === dashboardId) {
      setCurrentDashboard({
        ...currentDashboard,
        charts: currentDashboard.charts.filter(chart => chart.id !== chartId),
        updatedAt: new Date()
      });
    }
    
    toast({
      title: "Chart Removed",
      description: "Chart has been removed from the dashboard.",
    });
  };

  const toggleChartWidth = (dashboardId: string, chartId: string) => {
    // Check if it's a custom or system dashboard
    const isCustom = allCustomDashboards.some(d => d.id === dashboardId);
    
    if (isCustom) {
      setCustomDashboards(prevDashboards =>
        prevDashboards.map(dashboard =>
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
    } else {
      setSystemDashboards(prevDashboards =>
        prevDashboards.map(dashboard =>
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
    
    // Update current dashboard if it's the one being modified
    if (currentDashboard && currentDashboard.id === dashboardId) {
      setCurrentDashboard({
        ...currentDashboard,
        charts: currentDashboard.charts.map(chart => 
          chart.id === chartId 
            ? { ...chart, isFullWidth: !chart.isFullWidth }
            : chart
        ),
        updatedAt: new Date()
      });
    }
  };

  const saveChart = (chart: Chart, options: SaveChartOptions) => {
    if (options.saveType === 'analysisOnly') {
      toast({
        title: "Analysis Saved",
        description: "Your analysis has been saved for later use.",
      });
      return;
    }
    
    if (options.saveType === 'saveAndPin' && options.dashboardId) {
      addChart(options.dashboardId, chart);
      toast({
        title: "Analysis Pinned",
        description: `Your analysis has been added to the dashboard.`,
      });
      return;
    }
    
    if (options.saveType === 'saveAsNew') {
      // Create a new chart with a different ID but same data
      const newChart = {
        ...chart,
        id: `${chart.id}-copy-${Date.now()}`,
        title: `${chart.title} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      toast({
        title: "New Analysis Created",
        description: "A new copy of the analysis has been created.",
      });
      
      // If dashboardId is provided, also add to dashboard
      if (options.dashboardId) {
        addChart(options.dashboardId, newChart);
      }
    }
  };

  const updateChartOrder = (dashboardId: string, reorderedCharts: Chart[]) => {
    // Check if it's a custom or system dashboard
    const isCustom = allCustomDashboards.some(d => d.id === dashboardId);
    
    if (isCustom) {
      setCustomDashboards(prevDashboards =>
        prevDashboards.map(dashboard =>
          dashboard.id === dashboardId
            ? { ...dashboard, charts: reorderedCharts, updatedAt: new Date() }
            : dashboard
        )
      );
    } else {
      setSystemDashboards(prevDashboards =>
        prevDashboards.map(dashboard =>
          dashboard.id === dashboardId
            ? { ...dashboard, charts: reorderedCharts, updatedAt: new Date() }
            : dashboard
        )
      );
    }
    
    // Update current dashboard if it's the one being modified
    if (currentDashboard && currentDashboard.id === dashboardId) {
      setCurrentDashboard({
        ...currentDashboard,
        charts: reorderedCharts,
        updatedAt: new Date()
      });
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        systemDashboards: allSystemDashboards,
        customDashboards: allCustomDashboards,
        currentDashboard,
        setCurrentDashboard,
        searchQuery,
        setSearchQuery,
        filteredDashboards: sortedFilteredDashboards,
        togglePinDashboard,
        renameDashboard,
        addChart,
        removeChart,
        toggleChartWidth,
        saveChart,
        updateChartOrder
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
