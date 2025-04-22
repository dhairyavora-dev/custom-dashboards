
export type DashboardType = 'system' | 'custom';

export interface Dashboard {
  id: string;
  name: string;
  type: DashboardType;
  isPinned?: boolean;
  charts: Chart[];
  createdAt: Date;
  updatedAt: Date;
}

export type ChartType = 'funnel' | 'rfm' | 'cohort' | 'userPath' | 'behavior';

export type DisplayMode = 'chart' | 'kpi' | 'chartAndKpi' | 'table' | 'transposedTable';

export interface Chart {
  id: string;
  title: string;
  description: string;
  type: ChartType;
  displayMode: DisplayMode;
  isFullWidth: boolean;
  data: any; // Would be replaced with actual chart data structure
  createdAt: Date;
  updatedAt: Date;
}

export interface SaveChartOptions {
  saveType: 'analysisOnly' | 'saveAndPin' | 'saveAsNew';
  dashboardId?: string; // Optional if not pinning to dashboard
}
