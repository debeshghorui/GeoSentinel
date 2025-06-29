'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressSimple as Progress } from '@/components/ui/progress-simple';
import { 
  Upload, 
  FileImage, 
  X, 
  CheckCircle, 
  AlertTriangle,
  Image as ImageIcon 
} from 'lucide-react';
import { toast } from 'sonner';
import { getFileUploadConfig } from '@/lib/config';

interface UploadedFile {
  file: File;
  preview: string;
  type: 'before' | 'after';
  status: 'uploading' | 'completed' | 'error';
  progress: number;
}

interface UploadZoneProps {
  onFilesReady: (beforeImage: File, afterImage: File) => void;
  isProcessing?: boolean;
}

export default function UploadZone({ onFilesReady, isProcessing = false }: UploadZoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  const uploadConfig = getFileUploadConfig();
  const MAX_FILE_SIZE = uploadConfig.maxSize;
  const SUPPORTED_FORMATS = uploadConfig.supportedFormats;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidType = file.type.startsWith('image/') || SUPPORTED_FORMATS.includes(extension);
      const isValidSize = file.size <= MAX_FILE_SIZE;
      
      if (!isValidSize) {
        toast.error(`File ${file.name} is too large. Maximum size: ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB`);
        return false;
      }
      
      return isValidType;
    });

    if (validFiles.length === 0) {
      toast.error(`Please upload valid image files (${SUPPORTED_FORMATS.join(', ')})`);
      return;
    }

    if (uploadedFiles.length + validFiles.length > 2) {
      toast.error('Maximum 2 images allowed (before and after)');
      return;
    }

    validFiles.forEach(file => {
      const newFile: UploadedFile = {
        file,
        preview: URL.createObjectURL(file),
        type: uploadedFiles.length === 0 ? 'before' : 'after',
        status: 'uploading',
        progress: 0,
      };

      setUploadedFiles(prev => [...prev, newFile]);

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          setUploadedFiles(prev =>
            prev.map(f =>
              f.file === file 
                ? { ...f, status: 'completed', progress: 100 }
                : f
            )
          );
          
          toast.success(`${file.name} uploaded successfully`);
        } else {
          setUploadedFiles(prev =>
            prev.map(f =>
              f.file === file ? { ...f, progress } : f
            )
          );
        }
      }, 200);
    });
  }, [uploadedFiles.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.tif', '.tiff'],
    },
    maxFiles: 2,
    disabled: isProcessing || uploadedFiles.length >= 2,
  });

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(prev => {
      const filtered = prev.filter(f => f.file !== fileToRemove);
      // Reassign types based on order
      return filtered.map((f, index) => ({
        ...f,
        type: index === 0 ? 'before' : 'after' as 'before' | 'after',
      }));
    });
    URL.revokeObjectURL(uploadedFiles.find(f => f.file === fileToRemove)?.preview || '');
  };

  const handleProcessImages = () => {
    const completedFiles = uploadedFiles.filter(f => f.status === 'completed');
    
    if (completedFiles.length !== 2) {
      toast.error('Please upload both before and after images');
      return;
    }

    const beforeFile = completedFiles.find(f => f.type === 'before')?.file;
    const afterFile = completedFiles.find(f => f.type === 'after')?.file;

    if (beforeFile && afterFile) {
      onFilesReady(beforeFile, afterFile);
    }
  };

  const canProcess = uploadedFiles.length === 2 && 
                   uploadedFiles.every(f => f.status === 'completed') && 
                   !isProcessing;

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
              isDragActive
                ? 'border-primary bg-primary/5 scale-105'
                : 'border-border hover:border-primary/50 hover:bg-muted/30'
            } ${uploadedFiles.length >= 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            
            <div className="space-y-4">
              <motion.div 
                className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
                animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
              >
                <Upload className="w-8 h-8 text-primary" />
              </motion.div>
              
              <div>
                <p className="text-lg font-medium mb-2">
                  {uploadedFiles.length === 0
                    ? 'Upload Before & After Images'
                    : uploadedFiles.length === 1
                    ? 'Upload Second Image'
                    : 'Both Images Uploaded'
                  }
                </p>
                <p className="text-muted-foreground">
                  {isDragActive
                    ? 'Drop your images here...'
                    : 'Drag & drop TIFF satellite images or click to browse'
                  }
                </p>
              </div>
              
              {uploadedFiles.length < 2 && (
                <Button variant="outline" disabled={isProcessing}>
                  <FileImage className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Uploaded Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uploadedFiles.map((uploadedFile) => (
                    <motion.div
                      key={uploadedFile.file.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative border rounded-lg p-4 space-y-3"
                    >
                      {/* Image Preview */}
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={uploadedFile.preview}
                          alt={`${uploadedFile.type} image`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge 
                            variant={uploadedFile.type === 'before' ? 'secondary' : 'default'}
                            className="capitalize"
                          >
                            {uploadedFile.type}
                          </Badge>
                        </div>
                      </div>

                      {/* File Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 min-w-0">
                          <ImageIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">
                              {uploadedFile.file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(uploadedFile.file.size / (1024 * 1024)).toFixed(1)} MB
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {uploadedFile.status === 'completed' && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                          {uploadedFile.status === 'error' && (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(uploadedFile.file)}
                            disabled={isProcessing}
                            className="h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {uploadedFile.status === 'uploading' && (
                        <div className="space-y-1">
                          <Progress value={uploadedFile.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground text-center">
                            {Math.round(uploadedFile.progress)}% uploaded
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Process Button */}
      {uploadedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            onClick={handleProcessImages}
            disabled={!canProcess}
            className="px-8"
          >
            {isProcessing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
                />
                Processing Images...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Start Change Detection Analysis
              </>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
} 