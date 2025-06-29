'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Satellite, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3,
  Layers,
  Download,
  Share,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

// Import our custom components
import UploadZone from '@/components/change-detection/UploadZone';
import ChartView from '@/components/change-detection/ChartView';
import MaskOverlay from '@/components/change-detection/MaskOverlay';
import AlertBanner from '@/components/change-detection/AlertBanner';

// Import API utilities
import { processImages, ProcessImagesResponse } from '@/utils/api';
import { config, getAlertThresholds, isFeatureEnabled } from '@/lib/config';

interface ProcessingResult {
  changePercent: number;
  alert: string | null;
  history: Array<{
    timestamp: string;
    changePercent: number;
    alert?: string;
  }>;
  maskUrl: string;
  processedAt: string;
  aoiName?: string;
  analysisType?: string;
}

export default function ChangeDetectionPage() {
  // Configuration from centralized config
  const ENABLE_ANALYTICS = isFeatureEnabled('enableAnalytics');
  const ENABLE_DOWNLOADS = isFeatureEnabled('enableDownloads');
  const thresholds = getAlertThresholds();
  const WARNING_THRESHOLD = thresholds.warning;
  const CRITICAL_THRESHOLD = thresholds.critical;
  const PROCESSING_TIMEOUT = config.processing.defaultTimeout;

  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessingResult | null>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [alerts, setAlerts] = useState<any[]>([]);

  // Mock data for demonstration
  const mockHistory = [
    {
      timestamp: '2024-01-01T00:00:00Z',
      changePercent: 5.2,
    },
    {
      timestamp: '2024-01-05T00:00:00Z',
      changePercent: 7.8,
    },
    {
      timestamp: '2024-01-10T00:00:00Z',
      changePercent: 12.3,
      alert: 'Vegetation loss detected',
    },
    {
      timestamp: '2024-01-15T00:00:00Z',
      changePercent: 18.7,
      alert: 'Critical deforestation',
    },
    {
      timestamp: '2024-01-20T00:00:00Z',
      changePercent: 23.1,
      alert: 'Urgent intervention required',
    },
  ];

  const handleFilesReady = async (beforeImage: File, afterImage: File) => {
    setIsProcessing(true);
    setActiveTab('processing');

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));

      // In a real implementation, call the backend API
      // const response = await processImages({
      //   beforeImage,
      //   afterImage,
      //   metadata: {
      //     aoiName: 'Sample AOI',
      //     analysisType: 'vegetation_change',
      //   }
      // });

      // Mock response for demonstration
      const mockResponse: ProcessingResult = {
        changePercent: 23.1,
        alert: 'Critical vegetation loss detected',
        history: mockHistory,
        maskUrl: '/api/placeholder/mask.png', // This would be a real URL from the backend
        processedAt: new Date().toISOString(),
        aoiName: 'Amazon Forest Section A',
        analysisType: 'Vegetation Change Detection',
      };

      setResults(mockResponse);
      
      // Create alert if threshold exceeded
      if (mockResponse.changePercent > WARNING_THRESHOLD) {
        const newAlert = {
          id: `alert-${Date.now()}`,
          type: mockResponse.changePercent > CRITICAL_THRESHOLD ? 'critical' : 'warning',
          title: 'Change Detection Alert',
          message: mockResponse.alert || `${mockResponse.changePercent}% change detected`,
          timestamp: new Date().toISOString(),
          changePercent: mockResponse.changePercent,
          aoiName: mockResponse.aoiName,
          threshold: WARNING_THRESHOLD,
          actions: [
            {
              label: 'View Details',
              action: () => setActiveTab('results'),
              variant: 'default' as const,
            },
            {
              label: 'Download Report',
              action: () => toast.success('Report download started'),
              variant: 'outline' as const,
            },
          ],
        };
        setAlerts(prev => [newAlert, ...prev]);
      }

      setActiveTab('results');
      toast.success('Change detection analysis completed!');

    } catch (error) {
      console.error('Processing error:', error);
      toast.error('Failed to process images. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadMask = () => {
    if (results?.maskUrl) {
      // Create a temporary link to download the mask
      const link = document.createElement('a');
      link.href = results.maskUrl;
      link.download = 'change-detection-mask.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Mask download started');
    }
  };

  const handleShareResults = () => {
    if (results) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Results link copied to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-chart-4 rounded-lg flex items-center justify-center">
                <Satellite className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Change Detection Analysis</h1>
                <p className="text-sm text-muted-foreground">
                  Advanced satellite imagery analysis for environmental monitoring
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {results && (
                <>
                  <Button variant="outline" size="sm" onClick={handleShareResults}>
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadMask}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Alert Banner */}
        <AlertBanner
          alerts={alerts}
          onDismiss={(id) => setAlerts(prev => prev.filter(a => a.id !== id))}
          onDismissAll={() => setAlerts([])}
          maxVisible={2}
        />

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Satellite className="w-4 h-4" />
              <span>Upload</span>
            </TabsTrigger>
            <TabsTrigger value="processing" disabled={!isProcessing}>
              <div className="flex items-center space-x-2">
                {isProcessing && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                  />
                )}
                <span>Processing</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!results}>
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4" />
                <span>Results</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="analytics" disabled={!results}>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Upload Satellite Images</CardTitle>
                  <CardDescription>
                    Upload before and after TIFF satellite images to detect changes in your area of interest.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UploadZone 
                    onFilesReady={handleFilesReady}
                    isProcessing={isProcessing}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>How it Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-lg font-bold text-primary">1</span>
                      </div>
                      <h3 className="font-medium">Upload Images</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload two TIFF satellite images: one before and one after the time period you want to analyze.
                      </p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-lg font-bold text-primary">2</span>
                      </div>
                      <h3 className="font-medium">AI Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        Our advanced AI algorithms analyze the images to detect and quantify changes.
                      </p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-lg font-bold text-primary">3</span>
                      </div>
                      <h3 className="font-medium">View Results</h3>
                      <p className="text-sm text-muted-foreground">
                        Get detailed change maps, statistics, and alerts for immediate action.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Processing Tab */}
          <TabsContent value="processing" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto"
                    />
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Processing Images</h2>
                      <p className="text-muted-foreground">
                        Our AI is analyzing your satellite images to detect changes...
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
                        <span>• Image preprocessing</span>
                        <span>• Feature extraction</span>
                        <span>• Change detection</span>
                        <span>• Result generation</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {results && (
              <>
                {/* Summary Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Change Detected</p>
                          <p className="text-3xl font-bold">{results.changePercent.toFixed(1)}%</p>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Alert Level</p>
                          <p className="text-lg font-medium">
                            {results.changePercent > 20 ? 'Critical' : 
                             results.changePercent > 10 ? 'Warning' : 'Normal'}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6 text-destructive" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Analysis Type</p>
                          <p className="text-sm font-medium">{results.analysisType}</p>
                        </div>
                        <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
                          <Layers className="w-6 h-6 text-chart-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Change Mask Overlay */}
                <MaskOverlay
                  maskUrl={results.maskUrl}
                  changePercent={results.changePercent}
                  alert={results.alert}
                  onDownload={handleDownloadMask}
                />
              </>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {results && (
              <ChartView
                data={results.history}
                title="Change Detection Timeline"
                description="Historical analysis of detected changes in your area of interest"
                chartType="area"
                showTrend={true}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 