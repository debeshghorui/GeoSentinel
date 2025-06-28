'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Layers, MapPin, Square, Circle, Hexagon as Polygon, Eye, EyeOff, Download, Settings, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/map/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-muted rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
});

const aoiData = [
  {
    id: 'AOI-001',
    name: 'Amazon Basin Section A',
    type: 'Deforestation Monitoring',
    status: 'active',
    lastUpdate: '2 hours ago',
    changeDetected: true,
    coordinates: [-3.4653, -62.2159],
  },
  {
    id: 'AOI-002',
    name: 'Lake Victoria North',
    type: 'Water Level Monitoring',
    status: 'active',
    lastUpdate: '6 hours ago',
    changeDetected: false,
    coordinates: [-0.3355, 33.8711],
  },
  {
    id: 'AOI-003',
    name: 'Mumbai Urban Expansion',
    type: 'Urban Growth',
    status: 'processing',
    lastUpdate: '1 day ago',
    changeDetected: true,
    coordinates: [19.0760, 72.8777],
  },
];

const layerTypes = [
  { id: 'satellite', name: 'Satellite Imagery', active: true },
  { id: 'changes', name: 'Change Detection', active: false },
  { id: 'vegetation', name: 'Vegetation Index', active: false },
  { id: 'water', name: 'Water Bodies', active: false },
  { id: 'urban', name: 'Urban Areas', active: false },
];

export default function MapViewerPage() {
  const [selectedAOI, setSelectedAOI] = useState(aoiData[0]);
  const [opacity, setOpacity] = useState([70]);
  const [layers, setLayers] = useState(layerTypes);
  const [drawingMode, setDrawingMode] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);

  const toggleLayer = (layerId: string) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === layerId ? { ...layer, active: !layer.active } : layer
      )
    );
  };

  const handleDrawingTool = (tool: string) => {
    setDrawingMode(drawingMode === tool ? null : tool);
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
          Interactive Map Viewer
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Visualize and analyze satellite imagery with interactive tools
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-3 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {selectedAOI.name}
                    </CardTitle>
                    <CardDescription>
                      {selectedAOI.type} • Last updated {selectedAOI.lastUpdate}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={selectedAOI.changeDetected ? 'destructive' : 'secondary'}
                    >
                      {selectedAOI.changeDetected ? 'Changes Detected' : 'No Changes'}
                    </Badge>
                    <Badge
                      variant={
                        selectedAOI.status === 'active'
                          ? 'default'
                          : selectedAOI.status === 'processing'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {selectedAOI.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative">
                  <MapComponent
                    center={selectedAOI.coordinates}
                    zoom={10}
                    aoiData={aoiData}
                    selectedAOI={selectedAOI}
                    onAOISelect={setSelectedAOI}
                  />
                  
                  {/* Map Controls */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2">
                    <Button size="sm" variant="secondary">
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary">
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Drawing Tools */}
                  <div className="absolute bottom-4 left-4 flex space-x-2">
                    <Button
                      size="sm"
                      variant={drawingMode === 'polygon' ? 'default' : 'secondary'}
                      onClick={() => handleDrawingTool('polygon')}
                    >
                      <Polygon className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={drawingMode === 'rectangle' ? 'default' : 'secondary'}
                      onClick={() => handleDrawingTool('rectangle')}
                    >
                      <Square className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={drawingMode === 'circle' ? 'default' : 'secondary'}
                      onClick={() => handleDrawingTool('circle')}
                    >
                      <Circle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Comparison Slider */}
          {compareMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Label>Before</Label>
                    <Slider
                      value={opacity}
                      onValueChange={setOpacity}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <Label>After</Label>
                    <span className="text-sm text-muted-foreground">
                      {opacity[0]}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* AOI Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Areas of Interest</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value={selectedAOI.id}
                onValueChange={(value) => {
                  const aoi = aoiData.find(a => a.id === value);
                  if (aoi) setSelectedAOI(aoi);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {aoiData.map((aoi) => (
                    <SelectItem key={aoi.id} value={aoi.id}>
                      {aoi.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="space-y-2">
                {aoiData.map((aoi) => (
                  <div
                    key={aoi.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedAOI.id === aoi.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedAOI(aoi)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{aoi.name}</p>
                        <p className="text-xs text-muted-foreground">{aoi.type}</p>
                      </div>
                      <Badge
                        variant={aoi.changeDetected ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {aoi.changeDetected ? 'Alert' : 'OK'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Layer Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Layers className="w-5 h-5" />
                <span>Map Layers</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {layers.map((layer) => (
                <div key={layer.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {layer.active ? (
                      <Eye className="w-4 h-4 text-primary" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    )}
                    <Label className="text-sm">{layer.name}</Label>
                  </div>
                  <Switch
                    checked={layer.active}
                    onCheckedChange={() => toggleLayer(layer.id)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Display Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Display Options</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Compare Mode</Label>
                <Switch
                  checked={compareMode}
                  onCheckedChange={setCompareMode}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Layer Opacity</Label>
                <Slider
                  value={opacity}
                  onValueChange={setOpacity}
                  max={100}
                  step={5}
                />
                <div className="text-xs text-muted-foreground text-center">
                  {opacity[0]}%
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Map Image
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export AOI Data
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}