import React, { useState, useRef } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import ChartCard from './ChartCard';
import SaveChartModal from './SaveChartModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Chart } from '@/types/dashboard';
import EmptyDashboard from './EmptyDashboard';
import SampleChartCard from './SampleChartCard';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CreateDashboardModal from './CreateDashboardModal';

const Dashboard: React.FC = () => {
  const { currentDashboard, renameDashboard } = useDashboard();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [sampleChart, setSampleChart] = useState<Chart | null>(null);
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { toast } = useToast();
  const [saveChartType, setSaveChartType] = useState<'chart' | 'table'>('chart');

  const handleEditTitle = () => {
    if (!currentDashboard) return;
    
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
    if (!currentDashboard) return;
    
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

  const handleAddAnalysis = (type?: ChartType) => {
    if (!currentDashboard) return;

    const newChart: Chart = {
      id: `chart-${Date.now()}`,
      title: `New ${type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Generic'} Analysis`,
      description: `This is a new ${type || 'generic'} analysis`,
      type: type || 'funnel',
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

  const handleSaveChart = (type: 'chart' | 'table') => {
    setSaveChartType(type);
    setSampleChart({
      id: `chart-${Date.now()}`,
      title: 'Sample Analysis',
      description: 'Sample description',
      type: 'bar',
      displayMode: type === 'chart' ? 'chart' : 'table',
      isFullWidth: false,
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        values: [4000, 3000, 2000, 2780, 1890]
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });
    setSaveModalOpen(true);
  };

  if (!currentDashboard) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <p className="text-muted-foreground">Select a dashboard from the sidebar</p>
      </div>
    );
  }

  const isSystemDashboard = currentDashboard ? ['home', 'behavior', 'revenue', 'raman'].includes(currentDashboard.id) : false;

  return (
    <div className="flex-1">
      {isSystemDashboard ? (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">{currentDashboard.name}</h1>
              <p className="text-sm text-muted-foreground">
                Sample dashboard with analysis examples
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="bg-[#00A5EC] hover:bg-[#0095D2] text-white">
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-md">
                      <DropdownMenuItem onClick={() => handleSaveChart('chart')} className="cursor-pointer hover:bg-slate-100">
                        Save chart to dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSaveChart('table')} className="cursor-pointer hover:bg-slate-100">
                        Save table to dashboard
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save this chart or table to a custom dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <SampleChartCard title="Sample Analysis" />
          </div>
        </div>
      ) : (
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

          <SubscriptionModal
            open={subscribeModalOpen}
            onOpenChange={setSubscribeModalOpen}
            dashboardName={currentDashboard.name}
          />

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
              <Button onClick={() => handleAddAnalysis()}>
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
              chartType={saveChartType}
            />
          )}
        </div>
      )}
      
      <CreateDashboardModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </div>
  );
};

export default Dashboard;
