import React, { useState, useRef } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import ChartCard from './ChartCard';
import SaveChartModal from './SaveChartModal';
import SubscriptionModal from './SubscriptionModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Bell } from 'lucide-react';
import { Chart, ChartType } from '@/types/dashboard';

const Dashboard: React.FC = () => {
  const { currentDashboard, renameDashboard } = useDashboard();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [sampleChart, setSampleChart] = useState<Chart | null>(null);
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  if (!currentDashboard) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <p className="text-muted-foreground">Select a dashboard from the sidebar</p>
      </div>
    );
  }

  const handleEditTitle = () => {
    setNewTitle(currentDashboard.name);
    setIsEditingTitle(true);
    setTimeout(() => {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }, 10);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleTitleSave = () => {
    if (newTitle && newTitle !== currentDashboard.name) {
      renameDashboard(currentDashboard.id, newTitle);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
    }
  };

  const handleAddAnalysis = (type: ChartType) => {
    const newChart: Chart = {
      id: `chart-${Date.now()}`,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Analysis`,
      description: `This is a new ${type} analysis`,
      type,
      displayMode: 'chart',
      isFullWidth: false,
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        values: [12, 19, 3, 5, 2]
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setSampleChart(newChart);
    setSaveModalOpen(true);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          {isEditingTitle ? (
            <div className="flex items-center">
              <Input
                ref={titleInputRef}
                type="text"
                value={newTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyDown}
                className="text-xl font-bold h-10"
              />
            </div>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h1 
                    className="text-2xl font-bold cursor-pointer hover:text-netcore-blue transition-colors"
                    onClick={handleEditTitle}
                  >
                    {currentDashboard.name}
                  </h1>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to rename your dashboard.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <p className="text-sm text-muted-foreground">
            Last updated: {currentDashboard.updatedAt.toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Analysis
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleAddAnalysis('funnel')}>
                      Funnel Analysis
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddAnalysis('rfm')}>
                      RFM Analysis
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddAnalysis('cohort')}>
                      Cohort Analysis
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddAnalysis('userPath')}>
                      User Path Analysis
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddAnalysis('behavior')}>
                      Behavior Analysis
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add charts from Funnel, RFM, Cohort, User Path, or Behavior dashboards.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={() => setSubscribeModalOpen(true)}>
                  <Bell className="mr-2 h-4 w-4" />
                  Subscribe
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Get email snapshots of this dashboard based on your preferred schedule.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {currentDashboard && (
        <SubscriptionModal
          open={subscribeModalOpen}
          onOpenChange={setSubscribeModalOpen}
          dashboardName={currentDashboard.name}
        />
      )}

      {currentDashboard.charts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {currentDashboard.charts.map((chart) => (
            <ChartCard key={chart.id} chart={chart} dashboardId={currentDashboard.id} />
          ))}
        </div>
      ) : (
        <div className="bg-muted rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium mb-2">No charts yet</h3>
          <p className="text-muted-foreground mb-4">Start by adding an analysis to this dashboard</p>
          <Button onClick={() => handleAddAnalysis('funnel')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Chart
          </Button>
        </div>
      )}
      
      {sampleChart && (
        <SaveChartModal
          chart={sampleChart}
          open={saveModalOpen}
          onOpenChange={setSaveModalOpen}
          chartType={sampleChart.type}
        />
      )}
    </div>
  );
};

export default Dashboard;
