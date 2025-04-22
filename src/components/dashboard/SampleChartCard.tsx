
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Save } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const sampleData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
];

interface SampleChartCardProps {
  title: string;
  onSaveChart: () => void;
  onSaveTable: () => void;
}

const SampleChartCard: React.FC<SampleChartCardProps> = ({
  title,
  onSaveChart,
  onSaveTable,
}) => {
  return (
    <Card className="w-full shadow-md rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 text-netcore-blue hover:text-netcore-blue hover:bg-netcore-light-blue">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-md">
                  <DropdownMenuItem onClick={onSaveChart} className="cursor-pointer hover:bg-slate-100">
                    Save chart to dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onSaveTable} className="cursor-pointer hover:bg-slate-100">
                    Save table to dashboard
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-800 text-white">
              <p>Add this chart or table to your custom dashboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="value" fill="#00A5EC" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Conversion Rate</span>
          <span className="text-xl font-semibold">24.8%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Daily Active Users</span>
          <span className="text-xl font-semibold">12,542</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SampleChartCard;
