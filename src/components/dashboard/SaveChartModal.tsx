
import React, { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { Chart, SaveChartOptions } from '@/types/dashboard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SaveChartModalProps {
  chart: Chart;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chartType: Chart['type'];
}

const SaveChartModal: React.FC<SaveChartModalProps> = ({
  chart,
  open,
  onOpenChange,
  chartType,
}) => {
  const { customDashboards, currentDashboard, saveChart } = useDashboard();
  const [saveType, setSaveType] = useState<SaveChartOptions['saveType']>('saveAndPin');
  const [dashboardId, setDashboardId] = useState(currentDashboard?.id || '');

  const handleSave = () => {
    const options: SaveChartOptions = {
      saveType,
      dashboardId,
    };
    
    saveChart(chart, options);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Analysis</DialogTitle>
          <DialogDescription>
            Choose how you want to save this analysis.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {chartType !== 'behavior' ? (
            <div className="space-y-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="analysis-only"
                        name="save-type"
                        value="analysisOnly"
                        checked={saveType === 'analysisOnly'}
                        onChange={() => setSaveType('analysisOnly')}
                      />
                      <label htmlFor="analysis-only">Save Analysis Only</label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Just save this configuration for later edits.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="save-and-pin"
                        name="save-type"
                        value="saveAndPin"
                        checked={saveType === 'saveAndPin'}
                        onChange={() => setSaveType('saveAndPin')}
                      />
                      <label htmlFor="save-and-pin">Save & Pin to Dashboard</label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save and immediately add to current dashboard view.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="save-as-new"
                        name="save-type"
                        value="saveAsNew"
                        checked={saveType === 'saveAsNew'}
                        onChange={() => setSaveType('saveAsNew')}
                      />
                      <label htmlFor="save-as-new">Save as New Analysis</label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Duplicate and modify without affecting the original.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            <div className="space-y-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="save-to-dashboard"
                        name="save-type"
                        value="saveAndPin"
                        checked={saveType === 'saveAndPin'}
                        onChange={() => setSaveType('saveAndPin')}
                      />
                      <label htmlFor="save-to-dashboard">Save to Dashboard</label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save and immediately add to current dashboard view.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="save-as-new"
                        name="save-type"
                        value="saveAsNew"
                        checked={saveType === 'saveAsNew'}
                        onChange={() => setSaveType('saveAsNew')}
                      />
                      <label htmlFor="save-as-new">Save as New Analysis</label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Duplicate and modify without affecting the original.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          {(saveType === 'saveAndPin' || saveType === 'saveAsNew') && (
            <div className="space-y-2">
              <label htmlFor="dashboard-select" className="text-sm font-medium">
                Select Dashboard
              </label>
              <Select value={dashboardId} onValueChange={setDashboardId}>
                <SelectTrigger id="dashboard-select">
                  <SelectValue placeholder="Select a dashboard" />
                </SelectTrigger>
                <SelectContent>
                  {customDashboards.map((dashboard) => (
                    <SelectItem key={dashboard.id} value={dashboard.id}>
                      {dashboard.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveChartModal;
