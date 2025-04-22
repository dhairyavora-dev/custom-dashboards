
import React, { useState } from 'react';
import { Chart as ChartType, DisplayMode } from '@/types/dashboard';
import { useDashboard } from '@/contexts/DashboardContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  RefreshCcw, 
  Edit, 
  Copy, 
  Download, 
  Trash2, 
  Info, 
  ArrowsUpDown, 
  LayoutGrid 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BarChart } from 'recharts';

// Sample chart components for different display modes
const ChartView = ({ data }: { data: any }) => (
  <div className="h-40 w-full flex items-center justify-center bg-netcore-light-blue bg-opacity-50 rounded-md">
    <BarChart width={300} height={150} data={data.values.map((val: number, i: number) => ({ name: data.labels[i], value: val }))}>
      {/* Chart components would go here */}
    </BarChart>
  </div>
);

const KpiView = ({ data }: { data: any }) => (
  <div className="h-40 w-full flex flex-col items-center justify-center bg-netcore-light-blue bg-opacity-50 rounded-md">
    <span className="text-4xl font-bold text-netcore-blue">
      {data.values.reduce((a: number, b: number) => a + b, 0)}
    </span>
    <span className="text-sm text-muted-foreground">Total Value</span>
  </div>
);

const ChartAndKpiView = ({ data }: { data: any }) => (
  <div className="h-40 w-full flex items-center justify-center space-x-4 bg-netcore-light-blue bg-opacity-50 rounded-md">
    <div className="flex-1">
      <ChartView data={data} />
    </div>
    <div className="w-1/3">
      <KpiView data={data} />
    </div>
  </div>
);

const TableView = ({ data }: { data: any }) => (
  <div className="h-40 w-full overflow-auto bg-netcore-light-blue bg-opacity-50 rounded-md">
    <table className="min-w-full">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left">Label</th>
          <th className="px-4 py-2 text-left">Value</th>
        </tr>
      </thead>
      <tbody>
        {data.labels.map((label: string, i: number) => (
          <tr key={i}>
            <td className="px-4 py-2 border-t">{label}</td>
            <td className="px-4 py-2 border-t">{data.values[i]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TransposedTableView = ({ data }: { data: any }) => (
  <div className="h-40 w-full overflow-auto bg-netcore-light-blue bg-opacity-50 rounded-md">
    <table className="min-w-full">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left">Metric</th>
          {data.labels.map((label: string, i: number) => (
            <th key={i} className="px-4 py-2 text-left">{label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="px-4 py-2 border-t">Value</td>
          {data.values.map((value: number, i: number) => (
            <td key={i} className="px-4 py-2 border-t">{value}</td>
          ))}
        </tr>
      </tbody>
    </table>
  </div>
);

interface ChartCardProps {
  chart: ChartType;
  dashboardId: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ chart, dashboardId }) => {
  const { removeChart, toggleChartWidth } = useDashboard();
  const [displayMode, setDisplayMode] = useState<DisplayMode>(chart.displayMode);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate a refresh operation
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleDelete = () => {
    removeChart(dashboardId, chart.id);
  };

  const handleToggleWidth = () => {
    toggleChartWidth(dashboardId, chart.id);
  };

  const handleCopyLink = () => {
    // In a real app, this would copy a shareable link
    navigator.clipboard.writeText(`https://netcore.cloud/dashboard/${dashboardId}/chart/${chart.id}`);
  };

  const renderChart = () => {
    switch (displayMode) {
      case 'chart':
        return <ChartView data={chart.data} />;
      case 'kpi':
        return <KpiView data={chart.data} />;
      case 'chartAndKpi':
        return <ChartAndKpiView data={chart.data} />;
      case 'table':
        return <TableView data={chart.data} />;
      case 'transposedTable':
        return <TransposedTableView data={chart.data} />;
      default:
        return <ChartView data={chart.data} />;
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-300 ease-in-out", 
      chart.isFullWidth ? "col-span-2" : "col-span-1"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-base">{chart.title}</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{chart.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={handleRefresh}
                  >
                    <RefreshCcw 
                      className={cn(
                        "h-4 w-4", 
                        isRefreshing && "animate-spin"
                      )} 
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh this chart with the latest data.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit filters or metrics of this analysis.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={handleCopyLink}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy shareable link to this chart.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Download className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Export as PNG</DropdownMenuItem>
                      <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export as PNG or CSV.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={handleToggleWidth}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Switch between half and full width.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove this chart from the dashboard.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-6 text-xs text-muted-foreground flex items-center space-x-1"
                    >
                      <span>Display Mode:</span>
                      <span className="font-medium">
                        {displayMode === 'chart' ? 'Chart' : 
                         displayMode === 'kpi' ? 'KPI' : 
                         displayMode === 'chartAndKpi' ? 'Chart + KPI' : 
                         displayMode === 'table' ? 'Table' : 
                         'Transposed Table'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setDisplayMode('chart')}>
                      Chart View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDisplayMode('kpi')}>
                      KPI View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDisplayMode('chartAndKpi')}>
                      Chart + KPI View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDisplayMode('table')}>
                      Table View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDisplayMode('transposedTable')}>
                      Transposed Table View
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>Switch to your preferred chart view.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="text-xs text-muted-foreground flex items-center h-6">
            <ArrowsUpDown className="h-3 w-3 mr-1" />
            <span>Drag to reorder</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default ChartCard;
