
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
              <DropdownMenuContent 
                align="end" 
                className="bg-white rounded-md border border-gray-200 shadow-md z-50"
              >
                <DropdownMenuItem 
                  onClick={() => onSaveChart('chart')} 
                  className="cursor-pointer hover:bg-slate-100"
                >
                  Save chart to dashboard
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onSaveChart('table')} 
                  className="cursor-pointer hover:bg-slate-100"
                >
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
  );
};

export default SystemDashboardHeader;
