
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Bell } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dashboard, ChartType } from '@/types/dashboard';

interface CustomDashboardHeaderProps {
  dashboard: Dashboard;
  isEditingTitle: boolean;
  newTitle: string;
  onEditTitle: () => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleSave: () => void;
  onTitleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onAddAnalysis: (type?: ChartType) => void;
  onSubscribe: () => void;
  isSystemDashboard?: boolean;
}

const CustomDashboardHeader: React.FC<CustomDashboardHeaderProps> = ({
  dashboard,
  isEditingTitle,
  newTitle,
  onEditTitle,
  onTitleChange,
  onTitleSave,
  onTitleKeyDown,
  onAddAnalysis,
  onSubscribe,
  isSystemDashboard = false,
}) => {
  const titleInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        {isEditingTitle ? (
          <div className="flex items-center">
            <Input
              ref={titleInputRef}
              type="text"
              value={newTitle}
              onChange={onTitleChange}
              onBlur={onTitleSave}
              onKeyDown={onTitleKeyDown}
              className="text-xl font-bold h-10"
            />
          </div>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <h1 
                  className="text-2xl font-bold cursor-pointer hover:text-netcore-blue transition-colors"
                  onClick={isSystemDashboard ? undefined : onEditTitle}
                >
                  {dashboard.name}
                </h1>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to rename your dashboard.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <p className="text-sm text-muted-foreground">
          {isSystemDashboard 
            ? "Sample dashboard with analysis examples" 
            : `Last updated: ${dashboard.updatedAt.toLocaleDateString()}`}
        </p>
      </div>
      
      {!isSystemDashboard && (
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
                    <DropdownMenuItem onClick={() => onAddAnalysis('funnel')}>
                      Funnel Analysis
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAddAnalysis('rfm')}>
                      RFM Analysis
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAddAnalysis('cohort')}>
                      Cohort Analysis
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAddAnalysis('userPath')}>
                      User Path Analysis
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAddAnalysis('behavior')}>
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
                <Button variant="outline" onClick={onSubscribe}>
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
      )}
    </div>
  );
};

export default CustomDashboardHeader;
