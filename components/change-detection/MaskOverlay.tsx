'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  Download, 
  Maximize2, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Layers,
  Settings
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface MaskOverlayProps {
  maskUrl: string;
  backgroundUrl?: string;
  title?: string;
  changePercent: number;
  alert?: string | null;
  onDownload?: () => void;
  className?: string;
}

export default function MaskOverlay({
  maskUrl,
  backgroundUrl,
  title = "Change Detection Mask",
  changePercent,
  alert,
  onDownload,
  className = ""
}: MaskOverlayProps) {
  const [opacity, setOpacity] = useState([70]);
  const [showMask, setShowMask] = useState(true);
  const [showBackground, setShowBackground] = useState(true);
  const [blendMode, setBlendMode] = useState<string>('normal');
  const [zoom, setZoom] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Handle image loading states
  const [maskLoaded, setMaskLoaded] = useState(false);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [maskError, setMaskError] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(100);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 400));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`space-y-4 ${className}`}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Layers className="w-5 h-5" />
                <span>{title}</span>
              </CardTitle>
              <div className="flex items-center space-x-3 mt-2">
                <Badge variant={changePercent > 10 ? 'destructive' : 'secondary'}>
                  {changePercent.toFixed(1)}% change detected
                </Badge>
                {alert && (
                  <Badge variant="destructive" className="animate-pulse">
                    Alert: {alert}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={resetView}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              {onDownload && (
                <Button variant="outline" size="sm" onClick={onDownload}>
                  <Download className="w-4 h-4" />
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <Label>Mask Opacity</Label>
              <div className="flex items-center space-x-3">
                <Slider
                  value={opacity}
                  onValueChange={setOpacity}
                  max={100}
                  step={5}
                  className="flex-1"
                  disabled={!showMask}
                />
                <span className="text-sm font-medium w-12">
                  {opacity[0]}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Blend Mode</Label>
              <Select value={blendMode} onValueChange={setBlendMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="multiply">Multiply</SelectItem>
                  <SelectItem value="overlay">Overlay</SelectItem>
                  <SelectItem value="screen">Screen</SelectItem>
                  <SelectItem value="color-burn">Color Burn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Show Mask</Label>
                <Switch checked={showMask} onCheckedChange={setShowMask} />
              </div>
              {backgroundUrl && (
                <div className="flex items-center justify-between">
                  <Label>Show Background</Label>
                  <Switch checked={showBackground} onCheckedChange={setShowBackground} />
                </div>
              )}
            </div>
          </div>

          {/* Image Display */}
          <div className="relative border border-border rounded-lg overflow-hidden bg-muted min-h-[400px]">
            <div 
              className="relative w-full h-[400px] cursor-move overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Background Image */}
              {backgroundUrl && showBackground && (
                <img
                  src={backgroundUrl}
                  alt="Background satellite image"
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom / 100})`,
                    transformOrigin: 'center',
                  }}
                  onLoad={() => setBackgroundLoaded(true)}
                />
              )}

              {/* Change Mask Overlay */}
              {showMask && (
                <img
                  src={maskUrl}
                  alt="Change detection mask"
                  className="absolute inset-0 w-full h-full object-contain transition-opacity duration-200"
                  style={{
                    opacity: opacity[0] / 100,
                    mixBlendMode: blendMode as any,
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom / 100})`,
                    transformOrigin: 'center',
                  }}
                  onLoad={() => setMaskLoaded(true)}
                  onError={() => setMaskError(true)}
                />
              )}

              {/* Loading State */}
              {(!maskLoaded || (!backgroundLoaded && backgroundUrl)) && !maskError && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="text-center space-y-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"
                    />
                    <p className="text-sm text-muted-foreground">Loading change detection mask...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {maskError && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                      <EyeOff className="w-6 h-6 text-destructive" />
                    </div>
                    <p className="text-sm font-medium">Failed to load mask</p>
                    <p className="text-xs text-muted-foreground">
                      Check if the mask URL is accessible
                    </p>
                  </div>
                </div>
              )}

              {/* Zoom Indicator */}
              {zoom !== 100 && (
                <div className="absolute top-4 left-4">
                  <Badge variant="outline" className="bg-background/80">
                    {zoom}%
                  </Badge>
                </div>
              )}
            </div>

            {/* Status Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border p-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span>Zoom: {zoom}%</span>
                  <span>Position: {position.x}, {position.y}</span>
                  {maskLoaded && (
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>Mask loaded</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span>Drag to pan • Scroll to zoom</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded" />
              <span className="text-sm">High Change</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded" />
              <span className="text-sm">Medium Change</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span className="text-sm">Low Change</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-transparent border border-muted-foreground rounded" />
              <span className="text-sm">No Change</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 