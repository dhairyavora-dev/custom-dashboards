
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart2,
  Funnel,
  Users,
  Activity
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyDashboardProps {
  onAddAnalysis: () => void;
}

const EmptyDashboard: React.FC<EmptyDashboardProps> = ({ onAddAnalysis }) => {
  const navigate = useNavigate();

  const analysisTiles = [
    {
      title: 'Behavior analysis',
      icon: Activity,
      tooltip: 'View user interactions like sessions, clicks, and events',
      path: '/behavior'
    },
    {
      title: 'Funnel analysis',
      icon: Funnel,
      tooltip: 'Track conversion steps and drop-offs across journeys',
      path: '/funnel'
    },
    {
      title: 'Retention analysis',
      icon: Users,
      tooltip: 'Measure user retention across cohorts and time intervals',
      path: '/retention'
    },
    {
      title: 'Session and source analysis',
      icon: BarChart2,
      tooltip: 'Analyze where your users come from and what they do',
      path: '/session'
    }
  ];

  return (
    <div className="flex-1 p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Add your first analysis</h1>
        <Button onClick={onAddAnalysis} className="bg-netcore-blue hover:bg-netcore-dark-blue">
          + Add Analysis
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {analysisTiles.map((tile, index) => {
          const Icon = tile.icon;
          return (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card 
                    className="cursor-pointer transition-all hover:shadow-lg hover:border-netcore-blue"
                    onClick={() => navigate(tile.path)}
                  >
                    <CardContent className="p-6 flex flex-col items-center space-y-4">
                      <Icon className="w-12 h-12 text-netcore-blue" />
                      <h3 className="text-lg font-medium">+ {tile.title}</h3>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tile.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
};

export default EmptyDashboard;
