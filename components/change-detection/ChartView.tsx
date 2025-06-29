'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Download, Maximize2 } from 'lucide-react';
import { useState } from 'react';

interface HistoryDataPoint {
  timestamp: string;
  changePercent: number;
  alert?: string;
  vegetationIndex?: number;
  waterLevel?: number;
  urbanExpansion?: number;
}

interface ChartViewProps {
  data: HistoryDataPoint[];
  title?: string;
  description?: string;
  chartType?: 'line' | 'area' | 'bar';
  showTrend?: boolean;
}

export default function ChartView({ 
  data, 
  title = "Change Detection Timeline",
  description = "Historical analysis of detected changes over time",
  chartType = 'area',
  showTrend = true 
}: ChartViewProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>('changePercent');
  const [timeRange, setTimeRange] = useState<string>('all');

  // Process data for display
  const processedData = data.map(point => ({
    ...point,
    date: new Date(point.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    fullDate: new Date(point.timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  }));

  // Calculate trend
  const calculateTrend = () => {
    if (data.length < 2) return { direction: 'stable', value: 0 };
    
    const recent = data.slice(-3).reduce((sum, point) => sum + point.changePercent, 0) / 3;
    const previous = data.slice(-6, -3).reduce((sum, point) => sum + point.changePercent, 0) / 3;
    
    const change = recent - previous;
    
    return {
      direction: change > 1 ? 'increasing' : change < -1 ? 'decreasing' : 'stable',
      value: Math.abs(change),
    };
  };

  const trend = calculateTrend();

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm">{data.fullDate}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any) => (
              <div key={entry.dataKey} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs text-muted-foreground capitalize">
                    {entry.dataKey.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {entry.value.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
          {data.alert && (
            <div className="mt-2 pt-2 border-t border-border">
              <Badge variant="destructive" className="text-xs">
                Alert: {data.alert}
              </Badge>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: processedData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="changePercent" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorChange" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="changePercent"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#colorChange)"
              strokeWidth={2}
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="changePercent" 
              fill="hsl(var(--primary))" 
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        );

      default:
        return <div>Chart type not supported</div>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{title}</span>
              </CardTitle>
              <CardDescription className="mt-1">
                {description}
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              <Select value={chartType} onValueChange={() => {}}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
              </Button>
              
              <Button variant="outline" size="sm">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center space-x-6 pt-4">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">
                {data.length > 0 ? data[data.length - 1].changePercent.toFixed(1) : '0'}%
              </div>
              <div className="text-sm text-muted-foreground">Latest Change</div>
            </div>
            
            {showTrend && (
              <div className="flex items-center space-x-2">
                {trend.direction === 'increasing' ? (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                ) : trend.direction === 'decreasing' ? (
                  <TrendingDown className="w-4 h-4 text-green-500" />
                ) : (
                  <div className="w-4 h-4 bg-muted rounded-full" />
                )}
                <div className="text-sm">
                  <span className="font-medium">
                    {trend.direction === 'stable' ? 'Stable' : 
                     trend.direction === 'increasing' ? 'Increasing' : 'Decreasing'}
                  </span>
                  {trend.value > 0 && (
                    <span className="text-muted-foreground ml-1">
                      ({trend.value.toFixed(1)}%)
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <div className="text-sm">
                <span className="font-medium">{data.length}</span>
                <span className="text-muted-foreground ml-1">data points</span>
              </div>
            </div>

            {data.some(d => d.alert) && (
              <Badge variant="destructive" className="animate-pulse">
                {data.filter(d => d.alert).length} alerts
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span>Change Percentage</span>
              </div>
              {data.some(d => d.alert) && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                  <span>Alert Threshold</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 