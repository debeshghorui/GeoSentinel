'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressSimple as Progress } from '@/components/ui/progress-simple';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Satellite,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  MapPin,
  Calendar,
  Download,
  Eye,
  Activity,
  Globe,
} from 'lucide-react';

const kpiData = [
  {
    title: 'Active AOIs',
    value: '12',
    change: '+2',
    changeType: 'positive',
    icon: MapPin,
    description: 'Areas under monitoring',
  },
  {
    title: 'Change Detections',
    value: '847',
    change: '+23%',
    changeType: 'positive',
    icon: TrendingUp,
    description: 'Changes identified this month',
  },
  {
    title: 'Critical Alerts',
    value: '3',
    change: '-2',
    changeType: 'negative',
    icon: AlertTriangle,
    description: 'Requiring immediate attention',
  },
  {
    title: 'Processing Time',
    value: '2.3min',
    change: '-15%',
    changeType: 'positive',
    icon: Activity,
    description: 'Average analysis time',
  },
];

const trendData = [
  { month: 'Jan', changes: 45, alerts: 2 },
  { month: 'Feb', changes: 52, alerts: 1 },
  { month: 'Mar', changes: 48, alerts: 3 },
  { month: 'Apr', changes: 61, alerts: 4 },
  { month: 'May', changes: 55, alerts: 2 },
  { month: 'Jun', changes: 67, alerts: 3 },
];

const changeTypeData = [
  { name: 'Vegetation', value: 35, color: '#10B981' },
  { name: 'Urban', value: 28, color: '#3B82F6' },
  { name: 'Water', value: 20, color: '#06B6D4' },
  { name: 'Other', value: 17, color: '#8B5CF6' },
];

const recentActivities = [
  {
    id: 1,
    type: 'alert',
    title: 'Critical deforestation detected',
    location: 'AOI-001 (Amazon Basin)',
    time: '2 hours ago',
    severity: 'high',
  },
  {
    id: 2,
    type: 'processing',
    title: 'Analysis completed',
    location: 'AOI-003 (Urban Expansion)',
    time: '4 hours ago',
    severity: 'low',
  },
  {
    id: 3,
    type: 'upload',
    title: 'New imagery uploaded',
    location: 'AOI-005 (Coastal Area)',
    time: '6 hours ago',
    severity: 'low',
  },
  {
    id: 4,
    type: 'alert',
    title: 'Water level change detected',
    location: 'AOI-002 (Lake Monitoring)',
    time: '8 hours ago',
    severity: 'medium',
  },
];

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          Dashboard Overview
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Monitor your satellite imagery analysis and change detection results
        </motion.p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={kpi.changeType === 'positive' ? 'default' : 'secondary'}
                    className={
                      kpi.changeType === 'positive'
                        ? 'bg-success/10 text-success hover:bg-success/20'
                        : 'bg-muted text-muted-foreground'
                    }
                  >
                    {kpi.change}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Detection Trends</CardTitle>
              <CardDescription>
                Monthly change detections and alerts over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="month"
                    className="text-muted-foreground"
                    fontSize={12}
                  />
                  <YAxis className="text-muted-foreground" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="changes"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Changes"
                  />
                  <Line
                    type="monotone"
                    dataKey="alerts"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    name="Alerts"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Change Types */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Change Types</CardTitle>
              <CardDescription>
                Distribution of detected change categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={changeTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {changeTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {changeTypeData.map((item) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {item.name} ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest changes and system updates
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 border border-border/30 hover:border-primary/30 transition-colors"
                >
                  <div
                    className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                      activity.severity === 'high'
                        ? 'bg-destructive'
                        : activity.severity === 'medium'
                        ? 'bg-warning'
                        : 'bg-success'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.location}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6 text-center">
            <Satellite className="w-12 h-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold mb-2">Upload New Images</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Add new satellite imagery for analysis
            </p>
            <Button size="sm">
              Start Upload
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6 text-center">
            <Globe className="w-12 h-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold mb-2">Explore Map</h3>
            <p className="text-muted-foreground text-sm mb-4">
              View and analyze your areas of interest
            </p>
            <Button size="sm">
              Open Map
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6 text-center">
            <Download className="w-12 h-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold mb-2">Generate Report</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Export analysis results and visualizations
            </p>
            <Button size="sm">
              Create Report
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}