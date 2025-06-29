'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ProgressSimple as Progress } from '@/components/ui/progress-simple';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  MapPin,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Satellite,
  Globe,
  Layers,
  Target,
} from 'lucide-react';

// Mock data for analytics
const timeSeriesData = [
  { month: 'Jan', vegetation: 85, urban: 12, water: 3, changes: 45, alerts: 2 },
  { month: 'Feb', vegetation: 82, urban: 14, water: 4, changes: 52, alerts: 1 },
  { month: 'Mar', vegetation: 78, urban: 16, water: 6, changes: 48, alerts: 3 },
  { month: 'Apr', vegetation: 75, urban: 18, water: 7, changes: 61, alerts: 4 },
  { month: 'May', vegetation: 73, urban: 19, water: 8, changes: 55, alerts: 2 },
  { month: 'Jun', vegetation: 70, urban: 21, water: 9, changes: 67, alerts: 3 },
  { month: 'Jul', vegetation: 68, urban: 22, water: 10, changes: 72, alerts: 5 },
  { month: 'Aug', vegetation: 65, urban: 24, water: 11, changes: 78, alerts: 4 },
  { month: 'Sep', vegetation: 67, urban: 23, water: 10, changes: 69, alerts: 2 },
  { month: 'Oct', vegetation: 69, urban: 22, water: 9, changes: 58, alerts: 1 },
  { month: 'Nov', vegetation: 71, urban: 21, water: 8, changes: 52, alerts: 2 },
  { month: 'Dec', vegetation: 73, urban: 20, water: 7, changes: 48, alerts: 1 },
];

const aoiPerformanceData = [
  { name: 'Amazon Basin A', accuracy: 94, changes: 23, alerts: 5, area: 1250 },
  { name: 'Lake Victoria N', accuracy: 97, changes: 12, alerts: 2, area: 890 },
  { name: 'Mumbai Urban', accuracy: 91, changes: 34, alerts: 8, area: 650 },
  { name: 'Sahel Region', accuracy: 89, changes: 18, alerts: 3, area: 2100 },
  { name: 'Coastal Florida', accuracy: 96, changes: 15, alerts: 4, area: 420 },
  { name: 'Arctic Tundra', accuracy: 92, changes: 8, alerts: 1, area: 1800 },
];

const changeTypeDistribution = [
  { name: 'Vegetation Loss', value: 35, color: '#EF4444', trend: '+12%' },
  { name: 'Urban Expansion', value: 28, color: '#3B82F6', trend: '+8%' },
  { name: 'Water Changes', value: 20, color: '#06B6D4', trend: '-3%' },
  { name: 'Agricultural', value: 12, color: '#10B981', trend: '+5%' },
  { name: 'Other', value: 5, color: '#8B5CF6', trend: '+2%' },
];

const processingMetrics = [
  { metric: 'Average Processing Time', value: '2.3 min', change: '-15%', positive: true },
  { metric: 'Detection Accuracy', value: '94.2%', change: '+2.1%', positive: true },
  { metric: 'False Positive Rate', value: '3.8%', change: '-0.5%', positive: true },
  { metric: 'Data Throughput', value: '1.2 GB/h', change: '+25%', positive: true },
];

const alertSeverityData = [
  { severity: 'Critical', count: 8, color: '#EF4444' },
  { severity: 'High', count: 15, color: '#F97316' },
  { severity: 'Medium', count: 23, color: '#EAB308' },
  { severity: 'Low', count: 12, color: '#10B981' },
];

const radarData = [
  { subject: 'Accuracy', A: 94, B: 89, fullMark: 100 },
  { subject: 'Speed', A: 87, B: 92, fullMark: 100 },
  { subject: 'Coverage', A: 91, B: 85, fullMark: 100 },
  { subject: 'Reliability', A: 96, B: 88, fullMark: 100 },
  { subject: 'Efficiency', A: 89, B: 91, fullMark: 100 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('12m');
  const [selectedAOI, setSelectedAOI] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <div className="flex items-center mt-1">
                <Badge
                  variant={trend === 'up' ? 'default' : trend === 'down' ? 'destructive' : 'secondary'}
                  className={
                    trend === 'up'
                      ? 'bg-success/10 text-success hover:bg-success/20'
                      : trend === 'down'
                      ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                      : 'bg-muted text-muted-foreground'
                  }
                >
                  {trend === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
                  {trend === 'down' && <TrendingDown className="w-3 h-3 mr-1" />}
                  {change}
                </Badge>
              </div>
            )}
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive insights into your satellite imagery analysis and change detection
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last Month</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="12m">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Total Changes Detected"
            value="1,247"
            change="+18%"
            trend="up"
            icon={Activity}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Active AOIs"
            value="24"
            change="+3"
            trend="up"
            icon={MapPin}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Detection Accuracy"
            value="94.2%"
            change="+2.1%"
            trend="up"
            icon={Target}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Processing Time"
            value="2.3 min"
            change="-15%"
            trend="up"
            icon={Clock}
          />
        </motion.div>
      </div>

      {/* Main Analytics Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Change Detection Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Change Detection Trends</span>
                  </CardTitle>
                  <CardDescription>
                    Monthly change detections and alert patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-muted-foreground" fontSize={12} />
                      <YAxis className="text-muted-foreground" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="changes"
                        stackId="1"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                        name="Changes"
                      />
                      <Area
                        type="monotone"
                        dataKey="alerts"
                        stackId="2"
                        stroke="hsl(var(--destructive))"
                        fill="hsl(var(--destructive))"
                        fillOpacity={0.6}
                        name="Alerts"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Change Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChartIcon className="w-5 h-5" />
                    <span>Change Type Distribution</span>
                  </CardTitle>
                  <CardDescription>
                    Breakdown of detected change categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={changeTypeDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {changeTypeDistribution.map((entry, index) => (
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
                  <div className="grid grid-cols-1 gap-3 mt-4">
                    {changeTypeDistribution.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{item.value}%</span>
                          <Badge variant="outline" className="text-xs">
                            {item.trend}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Land Cover Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layers className="w-5 h-5" />
                  <span>Land Cover Analysis</span>
                </CardTitle>
                <CardDescription>
                  Temporal changes in land cover composition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-muted-foreground" fontSize={12} />
                    <YAxis className="text-muted-foreground" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="vegetation"
                      stackId="1"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.8}
                      name="Vegetation %"
                    />
                    <Area
                      type="monotone"
                      dataKey="urban"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.8}
                      name="Urban %"
                    />
                    <Area
                      type="monotone"
                      dataKey="water"
                      stackId="1"
                      stroke="#06B6D4"
                      fill="#06B6D4"
                      fillOpacity={0.8}
                      name="Water %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Change Trends</CardTitle>
                  <CardDescription>
                    Seasonal patterns in change detection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-muted-foreground" fontSize={12} />
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
                        strokeWidth={3}
                        name="Changes"
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="alerts"
                        stroke="hsl(var(--destructive))"
                        strokeWidth={3}
                        name="Alerts"
                        dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* AOI Performance Scatter */}
              <Card>
                <CardHeader>
                  <CardTitle>AOI Performance Matrix</CardTitle>
                  <CardDescription>
                    Accuracy vs. change detection rate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart data={aoiPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        type="number"
                        dataKey="accuracy"
                        name="Accuracy"
                        unit="%"
                        domain={[85, 100]}
                        className="text-muted-foreground"
                        fontSize={12}
                      />
                      <YAxis
                        type="number"
                        dataKey="changes"
                        name="Changes"
                        className="text-muted-foreground"
                        fontSize={12}
                      />
                      <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value, name) => [value, name]}
                        labelFormatter={(label) => `AOI: ${label}`}
                      />
                      <Scatter
                        dataKey="changes"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Processing Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Processing Performance Metrics</CardTitle>
                <CardDescription>
                  System performance indicators over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {processingMetrics.map((metric, index) => (
                    <motion.div
                      key={metric.metric}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center p-4 bg-muted/30 rounded-lg"
                    >
                      <p className="text-sm text-muted-foreground mb-2">{metric.metric}</p>
                      <p className="text-2xl font-bold mb-1">{metric.value}</p>
                      <Badge
                        variant={metric.positive ? 'default' : 'destructive'}
                        className={
                          metric.positive
                            ? 'bg-success/10 text-success hover:bg-success/20'
                            : 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                        }
                      >
                        {metric.positive ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {metric.change}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Performance Radar */}
              <Card>
                <CardHeader>
                  <CardTitle>System Performance Radar</CardTitle>
                  <CardDescription>
                    Multi-dimensional performance analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" className="text-muted-foreground" fontSize={12} />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        className="text-muted-foreground"
                        fontSize={10}
                      />
                      <Radar
                        name="Current"
                        dataKey="A"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Radar
                        name="Previous"
                        dataKey="B"
                        stroke="hsl(var(--muted-foreground))"
                        fill="hsl(var(--muted-foreground))"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* AOI Performance Table */}
              <Card>
                <CardHeader>
                  <CardTitle>AOI Performance Rankings</CardTitle>
                  <CardDescription>
                    Top performing areas of interest
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aoiPerformanceData.map((aoi, index) => (
                      <div
                        key={aoi.name}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{aoi.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {aoi.area} km² • {aoi.changes} changes
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{aoi.accuracy}%</p>
                          <p className="text-sm text-muted-foreground">accuracy</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Processing Queue Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Satellite className="w-5 h-5" />
                  <span>Processing Queue Status</span>
                </CardTitle>
                <CardDescription>
                  Current processing jobs and system load
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Queue Length</span>
                      <Badge variant="secondary">12 jobs</Badge>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Estimated completion: 45 minutes
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">CPU Usage</span>
                      <Badge variant="secondary">68%</Badge>
                    </div>
                    <Progress value={68} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      8 cores active
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Memory Usage</span>
                      <Badge variant="secondary">52%</Badge>
                    </div>
                    <Progress value={52} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      41.6 GB / 80 GB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Alert Severity Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Alert Severity Distribution</span>
                  </CardTitle>
                  <CardDescription>
                    Breakdown of alert types and severity levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={alertSeverityData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="severity" className="text-muted-foreground" fontSize={12} />
                      <YAxis className="text-muted-foreground" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {alertSeverityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Critical Alerts</CardTitle>
                  <CardDescription>
                    Latest high-priority change detections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        id: 1,
                        title: 'Rapid deforestation detected',
                        location: 'Amazon Basin A',
                        severity: 'critical',
                        time: '2 hours ago',
                        change: '23% vegetation loss',
                      },
                      {
                        id: 2,
                        title: 'Urban expansion threshold exceeded',
                        location: 'Mumbai Urban',
                        severity: 'high',
                        time: '6 hours ago',
                        change: '15% new construction',
                      },
                      {
                        id: 3,
                        title: 'Water level significant change',
                        location: 'Lake Victoria N',
                        severity: 'medium',
                        time: '12 hours ago',
                        change: '8% water area reduction',
                      },
                      {
                        id: 4,
                        title: 'Coastal erosion detected',
                        location: 'Coastal Florida',
                        severity: 'high',
                        time: '1 day ago',
                        change: '12m shoreline retreat',
                      },
                    ].map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-start space-x-4 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
                      >
                        <div
                          className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                            alert.severity === 'critical'
                              ? 'bg-destructive'
                              : alert.severity === 'high'
                              ? 'bg-orange-500'
                              : 'bg-yellow-500'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{alert.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {alert.location} • {alert.change}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {alert.time}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alert Response Times */}
            <Card>
              <CardHeader>
                <CardTitle>Alert Response Performance</CardTitle>
                <CardDescription>
                  Average response times and resolution rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-6 h-6 text-success" />
                    </div>
                    <p className="text-2xl font-bold">94%</p>
                    <p className="text-sm text-muted-foreground">Resolution Rate</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-2xl font-bold">4.2h</p>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <AlertTriangle className="w-6 h-6 text-warning" />
                    </div>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-sm text-muted-foreground">Active Alerts</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Globe className="w-6 h-6 text-chart-4" />
                    </div>
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-sm text-muted-foreground">Monitored AOIs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}