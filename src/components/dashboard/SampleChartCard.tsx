
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
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
}

const SampleChartCard: React.FC<SampleChartCardProps> = ({
  title,
}) => {
  return (
    <Card className="w-full shadow-md rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
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
