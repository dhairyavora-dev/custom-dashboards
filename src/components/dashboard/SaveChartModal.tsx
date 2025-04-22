
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
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SaveChartModalProps {
  chart: Chart;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chartType: 'chart' | 'table' | 'studio';
}

const SaveChartModal: React.FC<SaveChartModalProps> = ({
  chart,
  open,
  onOpenChange,
  chartType,
}) => {
  const { customDashboards, currentDashboard, saveChart } = useDashboard();
  const { toast } = useToast();
  const [saveType, setSaveType] = useState<'existing' | 'new'>('existing');
  const [dashboardId, setDashboardId] = useState('');
  const [newDashboardName, setNewDashboardName] = useState('');
  const [chartName, setChartName] = useState(chart.title || 'Sample Analysis');
  const [description, setDescription] = useState(chart.description || '');

  const isFormValid = 
    (saveType === 'existing' && dashboardId) || 
    (saveType === 'new' && newDashboardName.trim().length > 0) && 
    chartName.trim().length > 0;

  const handleSave = () => {
    const targetDashboardName = saveType === 'existing' 
      ? customDashboards.find(d => d.id === dashboardId)?.name || 'dashboard'
      : newDashboardName;
      
    const options: SaveChartOptions = {
      saveType: 'saveAndPin',
      dashboardId: dashboardId,
      newDashboardName: saveType === 'new' ? newDashboardName : undefined,
      chartName: chartName,
      description: description,
    };
    
    saveChart({
      ...chart,
      title: chartName,
      description: description,
      displayMode: chartType,
    }, options);
    
    toast({
      title: "Success",
      description: `Chart saved to '${targetDashboardName}' successfully`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-lg">
        <DialogHeader className="bg-[#003E6B] text-white p-4 rounded-t-lg -mt-6 -mx-6 mb-2">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-semibold">
              Save {chartType.charAt(0).toUpperCase() + chartType.slice(1)} to Dashboard
            </DialogTitle>
            <DialogClose className="rounded-full h-6 w-6 p-0 flex items-center justify-center">
              <X className="h-4 w-4" />
            </DialogClose>
          </div>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Choose dashboard</h3>
            <RadioGroup 
              value={saveType} 
              onValueChange={(value: 'existing' | 'new') => setSaveType(value)}
              className="flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="existing" id="existing" />
                <Label htmlFor="existing">Select existing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new">Create new</Label>
              </div>
            </RadioGroup>
            
            {saveType === 'existing' ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Select value={dashboardId} onValueChange={setDashboardId}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select dashboard" />
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
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Choose from your existing dashboards</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div>
                <Input 
                  placeholder="Enter dashboard name" 
                  value={newDashboardName}
                  onChange={(e) => setNewDashboardName(e.target.value)}
                />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="chart-name">Chart name</Label>
              <span className="text-xs text-muted-foreground">{chartName.length}/50</span>
            </div>
            <Input
              id="chart-name"
              placeholder="Give a name to chart"
              maxLength={50}
              value={chartName}
              onChange={(e) => setChartName(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="description">Description</Label>
              <span className="text-xs text-muted-foreground">{description.length}/1000</span>
            </div>
            <Textarea
              id="description"
              placeholder="Add description here"
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] w-full"
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!isFormValid}
            className="bg-[#00A5EC] hover:bg-[#0095D2] text-white"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveChartModal;
