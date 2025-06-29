'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProgressSimple as Progress } from '@/components/ui/progress-simple';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Download,
  FileImage,
  FileText,
  Database,
  Archive,
  Search,
  Filter,
  Calendar,
  MapPin,
  Eye,
  Trash2,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  FolderOpen,
  HardDrive,
  CloudDownload,
  Share,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

interface DownloadItem {
  id: string;
  name: string;
  type: 'image' | 'report' | 'data' | 'archive';
  format: string;
  size: string;
  status: 'completed' | 'processing' | 'failed' | 'queued';
  createdAt: string;
  aoiName: string;
  analysisType: string;
  downloadCount: number;
  expiresAt?: string;
  progress?: number;
}

const mockDownloads: DownloadItem[] = [
  {
    id: '1',
    name: 'Amazon_Basin_A_Change_Detection_Report',
    type: 'report',
    format: 'PDF',
    size: '12.4 MB',
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    aoiName: 'Amazon Basin A',
    analysisType: 'Deforestation Detection',
    downloadCount: 3,
    expiresAt: '2024-02-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Mumbai_Urban_Expansion_Masks',
    type: 'image',
    format: 'TIFF',
    size: '245.8 MB',
    status: 'completed',
    createdAt: '2024-01-14T15:45:00Z',
    aoiName: 'Mumbai Urban',
    analysisType: 'Urban Growth',
    downloadCount: 1,
    expiresAt: '2024-02-14T15:45:00Z',
  },
  {
    id: '3',
    name: 'Lake_Victoria_Water_Analysis_Data',
    type: 'data',
    format: 'CSV',
    size: '8.2 MB',
    status: 'processing',
    createdAt: '2024-01-14T09:20:00Z',
    aoiName: 'Lake Victoria N',
    analysisType: 'Water Level Monitoring',
    downloadCount: 0,
    progress: 67,
  },
  {
    id: '4',
    name: 'Coastal_Florida_Complete_Analysis',
    type: 'archive',
    format: 'ZIP',
    size: '1.2 GB',
    status: 'completed',
    createdAt: '2024-01-13T14:15:00Z',
    aoiName: 'Coastal Florida',
    analysisType: 'Coastal Erosion',
    downloadCount: 2,
    expiresAt: '2024-02-13T14:15:00Z',
  },
  {
    id: '5',
    name: 'Sahel_Region_Vegetation_Index',
    type: 'data',
    format: 'JSON',
    size: '15.6 MB',
    status: 'failed',
    createdAt: '2024-01-13T11:00:00Z',
    aoiName: 'Sahel Region',
    analysisType: 'Vegetation Change',
    downloadCount: 0,
  },
  {
    id: '6',
    name: 'Arctic_Tundra_Time_Series',
    type: 'image',
    format: 'TIFF',
    size: '892.3 MB',
    status: 'queued',
    createdAt: '2024-01-12T16:30:00Z',
    aoiName: 'Arctic Tundra',
    analysisType: 'Climate Change',
    downloadCount: 0,
  },
];

const storageStats = {
  used: 2.4,
  total: 10,
  downloads: 156,
  activeJobs: 3,
};

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>(mockDownloads);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'queued':
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <FileImage className="w-4 h-4" />;
      case 'report':
        return <FileText className="w-4 h-4" />;
      case 'data':
        return <Database className="w-4 h-4" />;
      case 'archive':
        return <Archive className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleDownload = (item: DownloadItem) => {
    if (item.status !== 'completed') {
      toast.error('File is not ready for download');
      return;
    }
    
    // Simulate download
    toast.success(`Downloading ${item.name}...`);
    
    // Update download count
    setDownloads(prev =>
      prev.map(d =>
        d.id === item.id ? { ...d, downloadCount: d.downloadCount + 1 } : d
      )
    );
  };

  const handleDelete = (itemId: string) => {
    setDownloads(prev => prev.filter(d => d.id !== itemId));
    toast.success('File deleted successfully');
  };

  const handleBulkDownload = () => {
    const selectedFiles = downloads.filter(d => 
      selectedItems.includes(d.id) && d.status === 'completed'
    );
    
    if (selectedFiles.length === 0) {
      toast.error('No completed files selected');
      return;
    }
    
    toast.success(`Downloading ${selectedFiles.length} files...`);
    setSelectedItems([]);
  };

  const handleRetry = (itemId: string) => {
    setDownloads(prev =>
      prev.map(d =>
        d.id === itemId ? { ...d, status: 'processing', progress: 0 } : d
      )
    );
    toast.success('Retrying file generation...');
  };

  const filteredDownloads = downloads.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.aoiName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getTabCount = (status: string) => {
    if (status === 'all') return downloads.length;
    return downloads.filter(d => d.status === status).length;
  };

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
            <h1 className="text-3xl font-bold">Downloads Center</h1>
            <p className="text-muted-foreground">
              Manage and download your satellite imagery analysis results
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            {selectedItems.length > 0 && (
              <Button onClick={handleBulkDownload} size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Selected ({selectedItems.length})
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Storage Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Storage Used</p>
                <p className="text-2xl font-bold">{storageStats.used} GB</p>
                <p className="text-xs text-muted-foreground">of {storageStats.total} GB</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-primary" />
              </div>
            </div>
            <Progress 
              value={(storageStats.used / storageStats.total) * 100} 
              className="mt-3 h-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
                <p className="text-2xl font-bold">{storageStats.downloads}</p>
                <p className="text-xs text-muted-foreground">this month</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <CloudDownload className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                <p className="text-2xl font-bold">{storageStats.activeJobs}</p>
                <p className="text-xs text-muted-foreground">processing</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available Files</p>
                <p className="text-2xl font-bold">{downloads.filter(d => d.status === 'completed').length}</p>
                <p className="text-xs text-muted-foreground">ready to download</p>
              </div>
              <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-chart-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search files, AOIs, or analysis types..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="queued">Queued</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="report">Reports</SelectItem>
                    <SelectItem value="data">Data</SelectItem>
                    <SelectItem value="archive">Archives</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Downloads List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              All ({getTabCount('all')})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({getTabCount('completed')})
            </TabsTrigger>
            <TabsTrigger value="processing">
              Processing ({getTabCount('processing')})
            </TabsTrigger>
            <TabsTrigger value="failed">
              Failed ({getTabCount('failed')})
            </TabsTrigger>
            <TabsTrigger value="queued">
              Queued ({getTabCount('queued')})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card>
              <CardContent className="p-0">
                <div className="space-y-0">
                  <AnimatePresence>
                    {filteredDownloads
                      .filter(item => activeTab === 'all' || item.status === activeTab)
                      .map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center space-x-4 p-6 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems([...selectedItems, item.id]);
                            } else {
                              setSelectedItems(selectedItems.filter(id => id !== item.id));
                            }
                          }}
                          className="rounded border-border"
                        />

                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                            {getTypeIcon(item.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="font-medium truncate">{item.name}</p>
                              <Badge variant="outline" className="text-xs">
                                {item.format}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{item.aoiName}</span>
                              </span>
                              <span>{item.analysisType}</span>
                              <span>{item.size}</span>
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(item.createdAt)}</span>
                              </span>
                            </div>
                            {item.status === 'processing' && item.progress && (
                              <div className="mt-2">
                                <Progress value={item.progress} className="h-1" />
                                <p className="text-xs text-muted-foreground mt-1">
                                  {item.progress}% complete
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(item.status)}
                            <Badge
                              variant={
                                item.status === 'completed'
                                  ? 'default'
                                  : item.status === 'failed'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {item.status}
                            </Badge>
                          </div>

                          {item.downloadCount > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {item.downloadCount} downloads
                            </Badge>
                          )}

                          <div className="flex items-center space-x-1">
                            {item.status === 'completed' && (
                              <Button
                                size="sm"
                                onClick={() => handleDownload(item)}
                                className="h-8"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            )}

                            {item.status === 'failed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRetry(item.id)}
                                className="h-8"
                              >
                                <RefreshCw className="w-4 h-4 mr-1" />
                                Retry
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
                                {item.status === 'completed' && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleDownload(item)}>
                                      <Download className="w-4 h-4 mr-2" />
                                      Download
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Share className="w-4 h-4 mr-2" />
                                      Share Link
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Copy className="w-4 h-4 mr-2" />
                                      Copy Link
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                  </>
                                )}
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Open AOI
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      className="text-destructive focus:text-destructive"
                                      onSelect={(e) => e.preventDefault()}
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete File</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{item.name}"? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(item.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {filteredDownloads.filter(item => activeTab === 'all' || item.status === activeTab).length === 0 && (
                    <div className="text-center py-12">
                      <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No files found</h3>
                      <p className="text-muted-foreground">
                        {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                          ? 'Try adjusting your search or filters'
                          : 'Upload some satellite imagery to get started'}
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