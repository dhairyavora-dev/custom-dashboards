
import React, { useState, useRef } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import ChartCard from './ChartCard';
import SaveChartModal from './SaveChartModal';
import { Chart, ChartType } from '@/types/dashboard';
import EmptyDashboard from './EmptyDashboard';
import SampleChartCard from './SampleChartCard';
import { useToast } from '@/hooks/use-toast';
import CreateDashboardModal from './CreateDashboardModal';
import SubscriptionModal from './SubscriptionModal';
import SystemDashboardHeader from './SystemDashboardHeader';
import CustomDashboardHeader from './CustomDashboardHeader';

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
          <SystemDashboardHeader
            dashboard={currentDashboard}
            onSaveChart={handleSaveChart}
          />
          <div className="grid grid-cols-1 gap-4">
            <SampleChartCard title="Sample Analysis" />
          </div>
        </div>
      ) : (
        <div className="flex-1 p-6 overflow-y-auto">
          <CustomDashboardHeader
            dashboard={currentDashboard}
            isEditingTitle={isEditingTitle}
            newTitle={newTitle}
            onEditTitle={handleEditTitle}
            onTitleChange={handleTitleChange}
            onTitleSave={handleTitleSave}
            onTitleKeyDown={handleTitleKeyDown}
            onAddAnalysis={handleAddAnalysis}
            onSubscribe={() => setSubscribeModalOpen(true)}
          />

          <SubscriptionModal
            open={subscribeModalOpen}
            onOpenChange={setSubscribeModalOpen}
            dashboardName={currentDashboard?.name || ''}
          />

          {currentDashboard.charts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {currentDashboard.charts.map((chart) => (
                <ChartCard key={chart.id} chart={chart} dashboardId={currentDashboard.id} />
              ))}
            </div>
          ) : (
            <EmptyDashboard onAddAnalysis={() => handleAddAnalysis()} />
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
