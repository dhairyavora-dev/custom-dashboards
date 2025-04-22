
import { Dashboard, Chart } from '../types/dashboard';

// Sample chart data
const generateSampleChart = (id: string, type: Chart['type'], index: number): Chart => ({
  id,
  title: `Sample ${type.charAt(0).toUpperCase() + type.slice(1)} Analysis ${index}`,
  description: `This is a sample ${type} analysis showing relevant metrics`,
  type,
  displayMode: 'chart',
  isFullWidth: false,
  data: {
    // Mock data would be here
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    values: [12, 19, 3, 5, 2]
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

// System dashboards
export const systemDashboards: Dashboard[] = [
  {
    id: 'home-dashboard',
    name: 'Home',
    type: 'system',
    charts: [
      generateSampleChart('home-chart-1', 'behavior', 1),
      generateSampleChart('home-chart-2', 'funnel', 2),
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'behavior-dashboard',
    name: 'Behavior',
    type: 'system',
    charts: [
      generateSampleChart('behavior-chart-1', 'behavior', 1),
      generateSampleChart('behavior-chart-2', 'behavior', 2),
      generateSampleChart('behavior-chart-3', 'behavior', 3),
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'revenue-dashboard',
    name: 'Revenue',
    type: 'system',
    charts: [
      generateSampleChart('revenue-chart-1', 'rfm', 1),
      generateSampleChart('revenue-chart-2', 'cohort', 2),
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'raman-dashboard',
    name: 'Raman',
    type: 'system',
    charts: [
      generateSampleChart('raman-chart-1', 'userPath', 1),
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Custom dashboards
export const customDashboards: Dashboard[] = [
  {
    id: 'custom-dashboard-1',
    name: 'Conversion Metrics',
    type: 'custom',
    isPinned: true,
    charts: [
      generateSampleChart('custom-chart-1', 'funnel', 1),
      generateSampleChart('custom-chart-2', 'behavior', 2),
      generateSampleChart('custom-chart-3', 'rfm', 3),
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'custom-dashboard-2',
    name: 'User Engagement',
    type: 'custom',
    charts: [
      generateSampleChart('custom-chart-4', 'behavior', 4),
      generateSampleChart('custom-chart-5', 'userPath', 5),
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'custom-dashboard-3',
    name: 'Revenue Analysis',
    type: 'custom',
    isPinned: true,
    charts: [
      generateSampleChart('custom-chart-6', 'rfm', 6),
      generateSampleChart('custom-chart-7', 'cohort', 7),
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Combine all dashboards
export const mockDashboards = [...systemDashboards, ...customDashboards];

// Helper function to get a dashboard by ID
export const getDashboardById = (id: string): Dashboard | undefined => {
  return mockDashboards.find(dashboard => dashboard.id === id);
};
