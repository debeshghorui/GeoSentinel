'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Upload,
  FileImage,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  Info,
  Satellite,
} from 'lucide-react';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  lastModified: number;
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [metadata, setMetadata] = useState({
    aoiName: '',
    description: '',
    acquisitionDate: '',
    satellite: '',
    analysisType: '',
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(Array.from(e.dataTransfer.files));
      }
    },
    []
  );

  const handleFiles = (fileList: File[]) => {
    const validFiles = fileList.filter(
      (file) =>
        file.type.includes('image') ||
        file.name.endsWith('.tif') ||
        file.name.endsWith('.tiff')
    );

    if (validFiles.length !== fileList.length) {
      toast.error('Some files were rejected. Only TIFF images are supported.');
    }

    const newFiles: UploadedFile[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'uploading',
      lastModified: file.lastModified,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id ? { ...f, progress: 100, status: 'completed' } : f
            )
          );
          toast.success(`${file.name} uploaded successfully`);
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id ? { ...f, progress } : f
            )
          );
        }
      }, 500);
    });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleStartProcessing = async () => {
    if (files.length === 0) {
      toast.error('Please upload at least one image file.');
      return;
    }

    if (!metadata.aoiName || !metadata.analysisType) {
      toast.error('Please fill in required metadata fields.');
      return;
    }

    setProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setProcessing(false);
    toast.success('Processing started! You can monitor progress in the Analytics section.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          Upload Satellite Imagery
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Upload LISS-4 multi-temporal TIFF images for change detection analysis
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>File Upload</span>
                </CardTitle>
                <CardDescription>
                  Drag and drop your TIFF satellite images or click to browse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                    dragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/30'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    multiple
                    accept=".tif,.tiff,image/*"
                    onChange={(e) =>
                      e.target.files && handleFiles(Array.from(e.target.files))
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <FileImage className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">
                        {dragActive ? 'Drop files here' : 'Upload your satellite images'}
                      </p>
                      <p className="text-muted-foreground">
                        Supports TIFF files up to 500MB each
                      </p>
                    </div>
                    <Button variant="outline">
                      Browse Files
                    </Button>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h4 className="font-medium">Uploaded Files</h4>
                    <AnimatePresence>
                      {files.map((file) => (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border rounded-lg p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <FileImage className="w-5 h-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-sm">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {file.status === 'completed' && (
                                <CheckCircle className="w-5 h-5 text-success" />
                              )}
                              {file.status === 'error' && (
                                <AlertCircle className="w-5 h-5 text-destructive" />
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(file.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          {file.status === 'uploading' && (
                            <Progress value={file.progress} className="h-2" />
                          )}
                          <Badge
                            variant={
                              file.status === 'completed'
                                ? 'default'
                                : file.status === 'error'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {file.status === 'completed'
                              ? 'Uploaded'
                              : file.status === 'error'
                              ? 'Error'
                              : `${Math.round(file.progress)}%`}
                          </Badge>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Metadata Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="w-5 h-5" />
                <span>Analysis Configuration</span>
              </CardTitle>
              <CardDescription>
                Provide metadata for accurate analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aoi-name">AOI Name *</Label>
                <Input
                  id="aoi-name"
                  placeholder="e.g., Forest Area A1"
                  value={metadata.aoiName}
                  onChange={(e) =>
                    setMetadata({ ...metadata, aoiName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the area and monitoring purpose"
                  rows={3}
                  value={metadata.description}
                  onChange={(e) =>
                    setMetadata({ ...metadata, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Acquisition Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    className="pl-10"
                    value={metadata.acquisitionDate}
                    onChange={(e) =>
                      setMetadata({ ...metadata, acquisitionDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="satellite">Satellite</Label>
                <Select
                  value={metadata.satellite}
                  onValueChange={(value) =>
                    setMetadata({ ...metadata, satellite: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select satellite" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="liss4">LISS-4</SelectItem>
                    <SelectItem value="landsat8">Landsat 8</SelectItem>
                    <SelectItem value="sentinel2">Sentinel-2</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="analysis-type">Analysis Type *</Label>
                <Select
                  value={metadata.analysisType}
                  onValueChange={(value) =>
                    setMetadata({ ...metadata, analysisType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select analysis type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetation">Vegetation Change</SelectItem>
                    <SelectItem value="urban">Urban Expansion</SelectItem>
                    <SelectItem value="water">Water Body Analysis</SelectItem>
                    <SelectItem value="deforestation">Deforestation</SelectItem>
                    <SelectItem value="general">General Change Detection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <Button
                onClick={handleStartProcessing}
                disabled={processing || files.length === 0}
                className="w-full"
              >
                {processing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <Satellite className="w-4 h-4 mr-2" />
                )}
                {processing ? 'Starting Analysis...' : 'Start Analysis'}
              </Button>
            </CardContent>
          </Card>

          {/* Processing Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Processing Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Upload at least 2 images for temporal comparison</p>
              <p>• Ensure images cover the same geographical area</p>
              <p>• TIFF format recommended for best results</p>
              <p>• Maximum file size: 500MB per image</p>
              <p>• Processing time: 2-10 minutes depending on image size</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}