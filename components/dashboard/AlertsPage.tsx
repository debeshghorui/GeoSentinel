'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ProgressSimple as Progress } from '@/components/ui/progress-simple';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertTriangle,
  Bell,
  Search,
  Filter,
  Calendar,
  MapPin,
  Eye,
  CheckCircle,
  X,
  MoreVertical,
  RefreshCw,
  Settings,
  Download,
  Share,
  ExternalLink,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Zap,
  Globe,
  Satellite,
  TreePine,
  Building,
  Waves,
  Mountain,
} from 'lucide-react';
import { toast } from 'sonner';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  type: 'deforestation' | 'urban_expansion' | 'water_change' | 'vegetation' | 'other';
  aoiName: string;
  aoiId: string;
  coordinates: [number, number];
  changePercentage: number;
  detectedAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  assignedTo?: string;
  confidence: number;
  affectedArea: number; // in km²
  previousValue?: number;
  currentValue?: number;
  threshold: number;
  images: string[];
  tags: string[];
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Critical Deforestation Detected',
    description: 'Rapid vegetation loss exceeding critical threshold in protected area',
    severity: 'critical',
    status: 'active',
    type: 'deforestation',
    aoiName: 'Amazon Basin A',
    aoiId: 'AOI-001',
    coordinates: [-3.4653, -62.2159],
    changePercentage: -23.4,
    detectedAt: '2024-01-15T08:30:00Z',
    confidence: 94,
    affectedArea: 12.5,
    previousValue: 85.2,
    currentValue: 65.3,
    threshold: 15,
    images: ['before.tiff', 'after.tiff', 'change_mask.tiff'],
    tags: ['protected_area', 'illegal_logging', 'urgent'],
  },
  {
    id: '2',
    title: 'Urban Expansion Threshold Exceeded',
    description: 'Significant urban growth detected beyond planned development zones',
    severity: 'high',
    status: 'acknowledged',
    type: 'urban_expansion',
    aoiName: 'Mumbai Urban',
    aoiId: 'AOI-003',
    coordinates: [19.0760, 72.8777],
    changePercentage: 18.7,
    detectedAt: '2024-01-14T15:45:00Z',
    acknowledgedAt: '2024-01-14T16:30:00Z',
    assignedTo: 'Urban Planning Team',
    confidence: 91,
    affectedArea: 8.3,
    previousValue: 45.2,
    currentValue: 53.6,
    threshold: 10,
    images: ['urban_before.tiff', 'urban_after.tiff'],
    tags: ['urban_planning', 'development', 'monitoring'],
  },
  {
    id: '3',
    title: 'Water Level Significant Change',
    description: 'Lake water area reduction detected, potential drought conditions',
    severity: 'medium',
    status: 'active',
    type: 'water_change',
    aoiName: 'Lake Victoria N',
    aoiId: 'AOI-002',
    coordinates: [-0.3355, 33.8711],
    changePercentage: -12.3,
    detectedAt: '2024-01-14T10:20:00Z',
    confidence: 87,
    affectedArea: 15.7,
    previousValue: 127.4,
    currentValue: 111.7,
    threshold: 8,
    images: ['water_before.tiff', 'water_after.tiff'],
    tags: ['drought', 'water_management', 'climate'],
  },
  {
    id: '4',
    title: 'Coastal Erosion Detected',
    description: 'Shoreline retreat beyond acceptable limits',
    severity: 'high',
    status: 'resolved',
    type: 'other',
    aoiName: 'Coastal Florida',
    aoiId: 'AOI-005',
    coordinates: [25.7617, -80.1918],
    changePercentage: -8.9,
    detectedAt: '2024-01-13T14:15:00Z',
    resolvedAt: '2024-01-14T09:30:00Z',
    assignedTo: 'Coastal Management',
    confidence: 89,
    affectedArea: 3.2,
    previousValue: 2.8,
    currentValue: 2.55,
    threshold: 5,
    images: ['coastal_before.tiff', 'coastal_after.tiff'],
    tags: ['coastal', 'erosion', 'climate_change'],
  },
  {
    id: '5',
    title: 'Vegetation Index Anomaly',
    description: 'Unusual vegetation patterns detected in agricultural area',
    severity: 'low',
    status: 'dismissed',
    type: 'vegetation',
    aoiName: 'Sahel Region',
    aoiId: 'AOI-004',
    coordinates: [14.5355, -14.7524],
    changePercentage: -6.2,
    detectedAt: '2024-01-13T11:00:00Z',
    confidence: 76,
    affectedArea: 22.1,
    previousValue: 0.72,
    currentValue: 0.67,
    threshold: 10,
    images: ['vegetation_before.tiff', 'vegetation_after.tiff'],
    tags: ['agriculture', 'seasonal', 'monitoring'],
  },
  {
    id: '6',
    title: 'Arctic Ice Coverage Change',
    description: 'Accelerated ice loss detected in monitoring region',
    severity: 'critical',
    status: 'active',
    type: 'other',
    aoiName: 'Arctic Tundra',
    aoiId: 'AOI-006',
    coordinates: [71.0, -8.0],
    changePercentage: -31.2,
    detectedAt: '2024-01-12T16:30:00Z',
    confidence: 96,
    affectedArea: 45.8,
    previousValue: 89.3,
    currentValue: 61.4,
    threshold: 20,
    images: ['ice_before.tiff', 'ice_after.tiff', 'temperature_map.tiff'],
    tags: ['climate_change', 'arctic', 'critical'],
  },
];

const alertStats = {
  total: 24,
  active: 8,
  critical: 2,
  resolved: 12,
  avgResponseTime: '4.2h',
  resolutionRate: 87,
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'acknowledged':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'resolved':
        return 'bg-success/10 text-success border-success/20';
      case 'dismissed':
        return 'bg-muted/10 text-muted-foreground border-muted/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deforestation':
        return <TreePine className="w-4 h-4" />;
      case 'urban_expansion':
        return <Building className="w-4 h-4" />;
      case 'water_change':
        return <Waves className="w-4 h-4" />;
      case 'vegetation':
        return <TreePine className="w-4 h-4" />;
      default:
        return <Mountain className="w-4 h-4" />;
    }
  };

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId
          ? {
              ...alert,
              status: 'acknowledged',
              acknowledgedAt: new Date().toISOString(),
              assignedTo: 'Current User',
            }
          : alert
      )
    );
    toast.success('Alert acknowledged');
  };

  const handleResolve = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId
          ? {
              ...alert,
              status: 'resolved',
              resolvedAt: new Date().toISOString(),
            }
          : alert
      )
    );
    toast.success('Alert resolved');
  };

  const handleDismiss = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, status: 'dismissed' } : alert
      )
    );
    toast.success('Alert dismissed');
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.aoiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesType = typeFilter === 'all' || alert.type === typeFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus && matchesType;
  });

  const getTabCount = (status: string) => {
    if (status === 'all') return alerts.length;
    return alerts.filter(a => a.status === status).length;
  };

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
                  variant={trend === 'up' ? 'destructive' : 'default'}
                  className={
                    trend === 'up'
                      ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                      : 'bg-success/10 text-success hover:bg-success/20'
                  }
                >
                  {trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
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
            <h1 className="text-3xl font-bold">Alert Management</h1>
            <p className="text-muted-foreground">
              Monitor and manage satellite imagery change detection alerts
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Active Alerts"
            value={alertStats.active}
            change="+2"
            trend="up"
            icon={AlertTriangle}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Critical Alerts"
            value={alertStats.critical}
            change="0"
            trend="down"
            icon={Zap}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Avg Response Time"
            value={alertStats.avgResponseTime}
            change="-15%"
            trend="down"
            icon={Clock}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Resolution Rate"
            value={`${alertStats.resolutionRate}%`}
            change="+5%"
            trend="down"
            icon={Target}
          />
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search alerts, AOIs, or descriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="deforestation">Deforestation</SelectItem>
                    <SelectItem value="urban_expansion">Urban Expansion</SelectItem>
                    <SelectItem value="water_change">Water Change</SelectItem>
                    <SelectItem value="vegetation">Vegetation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alerts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              All ({getTabCount('all')})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({getTabCount('active')})
            </TabsTrigger>
            <TabsTrigger value="acknowledged">
              Acknowledged ({getTabCount('acknowledged')})
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resolved ({getTabCount('resolved')})
            </TabsTrigger>
            <TabsTrigger value="dismissed">
              Dismissed ({getTabCount('dismissed')})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card>
              <CardContent className="p-0">
                <div className="space-y-0">
                  <AnimatePresence>
                    {filteredAlerts
                      .filter(alert => activeTab === 'all' || alert.status === activeTab)
                      .map((alert, index) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start space-x-4 p-6 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors"
                      >
                        {/* Severity Indicator */}
                        <div
                          className={`w-1 h-16 rounded-full flex-shrink-0 ${
                            alert.severity === 'critical'
                              ? 'bg-destructive'
                              : alert.severity === 'high'
                              ? 'bg-orange-500'
                              : alert.severity === 'medium'
                              ? 'bg-yellow-500'
                              : 'bg-blue-500'
                          }`}
                        />

                        {/* Alert Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                                {getTypeIcon(alert.type)}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{alert.title}</h3>
                                <p className="text-sm text-muted-foreground">{alert.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getSeverityColor(alert.severity)}>
                                {alert.severity.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className={getStatusColor(alert.status)}>
                                {alert.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                            <div className="flex items-center space-x-2 text-sm">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span>{alert.aoiName}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>{getTimeAgo(alert.detectedAt)}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Activity className="w-4 h-4 text-muted-foreground" />
                              <span className={alert.changePercentage < 0 ? 'text-destructive' : 'text-success'}>
                                {alert.changePercentage > 0 ? '+' : ''}{alert.changePercentage}%
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Target className="w-4 h-4 text-muted-foreground" />
                              <span>{alert.confidence}% confidence</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Affected area: {alert.affectedArea} km²</span>
                            <span>Threshold: {alert.threshold}%</span>
                            {alert.assignedTo && (
                              <span>Assigned to: {alert.assignedTo}</span>
                            )}
                          </div>

                          {/* Tags */}
                          <div className="flex items-center space-x-2 mt-3">
                            {alert.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedAlert(alert)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center space-x-2">
                                  {getTypeIcon(alert.type)}
                                  <span>{alert.title}</span>
                                  <Badge className={getSeverityColor(alert.severity)}>
                                    {alert.severity.toUpperCase()}
                                  </Badge>
                                </DialogTitle>
                                <DialogDescription>
                                  Detailed information about this alert
                                </DialogDescription>
                              </DialogHeader>
                              
                              {selectedAlert && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="font-medium mb-2">Alert Details</h4>
                                        <div className="space-y-2 text-sm">
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">AOI:</span>
                                            <span>{selectedAlert.aoiName}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Detected:</span>
                                            <span>{formatDate(selectedAlert.detectedAt)}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Change:</span>
                                            <span className={selectedAlert.changePercentage < 0 ? 'text-destructive' : 'text-success'}>
                                              {selectedAlert.changePercentage > 0 ? '+' : ''}{selectedAlert.changePercentage}%
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Confidence:</span>
                                            <span>{selectedAlert.confidence}%</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Affected Area:</span>
                                            <span>{selectedAlert.affectedArea} km²</span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <h4 className="font-medium mb-2">Values</h4>
                                        <div className="space-y-2 text-sm">
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Previous:</span>
                                            <span>{selectedAlert.previousValue}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Current:</span>
                                            <span>{selectedAlert.currentValue}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Threshold:</span>
                                            <span>{selectedAlert.threshold}%</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="font-medium mb-2">Status Timeline</h4>
                                        <div className="space-y-3">
                                          <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-destructive rounded-full" />
                                            <div className="text-sm">
                                              <p className="font-medium">Alert Detected</p>
                                              <p className="text-muted-foreground">{formatDate(selectedAlert.detectedAt)}</p>
                                            </div>
                                          </div>
                                          {selectedAlert.acknowledgedAt && (
                                            <div className="flex items-center space-x-3">
                                              <div className="w-2 h-2 bg-warning rounded-full" />
                                              <div className="text-sm">
                                                <p className="font-medium">Acknowledged</p>
                                                <p className="text-muted-foreground">{formatDate(selectedAlert.acknowledgedAt)}</p>
                                              </div>
                                            </div>
                                          )}
                                          {selectedAlert.resolvedAt && (
                                            <div className="flex items-center space-x-3">
                                              <div className="w-2 h-2 bg-success rounded-full" />
                                              <div className="text-sm">
                                                <p className="font-medium">Resolved</p>
                                                <p className="text-muted-foreground">{formatDate(selectedAlert.resolvedAt)}</p>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <h4 className="font-medium mb-2">Available Images</h4>
                                        <div className="space-y-2">
                                          {selectedAlert.images.map((image, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-sm">
                                              <span>{image}</span>
                                              <Button variant="ghost" size="sm">
                                                <Download className="w-3 h-3" />
                                              </Button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <Separator />
                                  
                                  <div className="flex justify-between">
                                    <div className="flex space-x-2">
                                      <Button variant="outline" size="sm">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        View on Map
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        <Share className="w-4 h-4 mr-2" />
                                        Share
                                      </Button>
                                    </div>
                                    <div className="flex space-x-2">
                                      {selectedAlert.status === 'active' && (
                                        <Button
                                          onClick={() => handleAcknowledge(selectedAlert.id)}
                                          size="sm"
                                        >
                                          Acknowledge
                                        </Button>
                                      )}
                                      {(selectedAlert.status === 'active' || selectedAlert.status === 'acknowledged') && (
                                        <Button
                                          onClick={() => handleResolve(selectedAlert.id)}
                                          size="sm"
                                        >
                                          Resolve
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {alert.status === 'active' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAcknowledge(alert.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Acknowledge
                            </Button>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => setSelectedAlert(alert)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View on Map
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share className="w-4 h-4 mr-2" />
                                Share Alert
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {alert.status === 'active' && (
                                <DropdownMenuItem onClick={() => handleAcknowledge(alert.id)}>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Acknowledge
                                </DropdownMenuItem>
                              )}
                              {(alert.status === 'active' || alert.status === 'acknowledged') && (
                                <DropdownMenuItem onClick={() => handleResolve(alert.id)}>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Resolve
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleDismiss(alert.id)}
                                className="text-muted-foreground"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Dismiss
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {filteredAlerts.filter(alert => activeTab === 'all' || alert.status === activeTab).length === 0 && (
                    <div className="text-center py-12">
                      <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No alerts found</h3>
                      <p className="text-muted-foreground">
                        {searchQuery || severityFilter !== 'all' || statusFilter !== 'all' || typeFilter !== 'all'
                          ? 'Try adjusting your search or filters'
                          : 'All clear! No alerts at this time.'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}