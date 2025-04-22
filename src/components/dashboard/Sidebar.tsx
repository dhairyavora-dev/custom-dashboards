
import React, { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { Dashboard } from '@/types/dashboard';
import { Pin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const { 
    systemDashboards, 
    filteredDashboards, 
    currentDashboard, 
    setCurrentDashboard, 
    searchQuery, 
    setSearchQuery,
    togglePinDashboard 
  } = useDashboard();

  const handleDashboardClick = (dashboard: Dashboard) => {
    setCurrentDashboard(dashboard);
  };

  const handlePinClick = (e: React.MouseEvent, dashboardId: string) => {
    e.stopPropagation();
    togglePinDashboard(dashboardId);
  };

  return (
    <aside className="bg-sidebar h-screen w-64 border-r border-border flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-netcore-blue">Netcore Cloud</h1>
        <p className="text-sm text-muted-foreground">Analytics Dashboard</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="py-2">
          <h2 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            System Dashboards
          </h2>
          <ul>
            {systemDashboards.map((dashboard) => (
              <li key={dashboard.id}>
                <button
                  onClick={() => handleDashboardClick(dashboard)}
                  className={cn(
                    "w-full text-left px-2 py-2 text-sm rounded-md mb-1 flex items-center",
                    currentDashboard?.id === dashboard.id
                      ? "bg-netcore-blue text-white"
                      : "hover:bg-muted"
                  )}
                >
                  {dashboard.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="py-2 border-t mt-2">
          <div className="flex items-center justify-between mb-2 px-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Custom Dashboards
            </h2>
            <span className="text-xs text-muted-foreground">
              {filteredDashboards.length}/10
            </span>
          </div>
          
          <div className="mb-2 px-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search dashboards..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 h-9 text-sm"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quickly find a dashboard by name. Pinned dashboards appear on top.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <ul>
            {filteredDashboards.length > 0 ? (
              filteredDashboards.map((dashboard) => (
                <li key={dashboard.id}>
                  <div className="relative group">
                    <button
                      onClick={() => handleDashboardClick(dashboard)}
                      className={cn(
                        "w-full text-left px-2 py-2 text-sm rounded-md mb-1 flex items-center justify-between",
                        currentDashboard?.id === dashboard.id
                          ? "bg-netcore-blue text-white"
                          : "hover:bg-muted"
                      )}
                    >
                      <span>{dashboard.name}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={(e) => handlePinClick(e, dashboard.id)}
                              className={cn(
                                "opacity-0 group-hover:opacity-100 transition-opacity",
                                dashboard.isPinned ? "opacity-100" : "",
                                currentDashboard?.id === dashboard.id ? "text-white" : "text-muted-foreground"
                              )}
                            >
                              <Pin className={cn("h-4 w-4", dashboard.isPinned ? "fill-current" : "")} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Pin dashboards to keep them at the top for quick access.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-2 py-2 text-sm text-muted-foreground">
                No dashboards found
              </li>
            )}
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
