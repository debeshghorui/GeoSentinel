'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface AOIData {
  id: string;
  name: string;
  type: string;
  status: string;
  lastUpdate: string;
  changeDetected: boolean;
  coordinates: [number, number];
}

interface MapComponentProps {
  center: [number, number];
  zoom: number;
  aoiData: AOIData[];
  selectedAOI: AOIData;
  onAOISelect: (aoi: AOIData) => void;
}

// Component to handle map updates
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
}

export default function MapComponent({ 
  center, 
  zoom, 
  aoiData, 
  selectedAOI, 
  onAOISelect 
}: MapComponentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[600px] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  // Create custom icons for different AOI statuses
  const createCustomIcon = (aoi: AOIData) => {
    const color = aoi.changeDetected 
      ? aoi.status === 'active' ? '#ef4444' : '#f97316'
      : '#10b981';
    
    return L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>
      `,
      className: 'custom-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  // Sample polygon coordinates for AOI boundaries
  const getAOIBoundary = (aoi: AOIData) => {
    const [lat, lng] = aoi.coordinates;
    const offset = 0.05;
    return [
      [lat + offset, lng - offset],
      [lat + offset, lng + offset],
      [lat - offset, lng + offset],
      [lat - offset, lng - offset],
    ] as [number, number][];
  };

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={false}
      >
        <MapUpdater center={center} zoom={zoom} />
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {aoiData.map((aoi) => (
          <div key={aoi.id}>
            {/* AOI Marker */}
            <Marker
              position={aoi.coordinates}
              icon={createCustomIcon(aoi)}
              eventHandlers={{
                click: () => onAOISelect(aoi),
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{aoi.name}</h3>
                  <p className="text-sm text-gray-600">{aoi.type}</p>
                  <p className="text-xs text-gray-500">
                    Status: {aoi.status} • {aoi.lastUpdate}
                  </p>
                  {aoi.changeDetected && (
                    <p className="text-xs text-red-600 font-medium mt-1">
                      ⚠️ Changes detected
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
            
            {/* AOI Boundary */}
            <Polygon
              positions={getAOIBoundary(aoi)}
              pathOptions={{
                color: aoi.id === selectedAOI.id ? '#3b82f6' : '#64748b',
                weight: aoi.id === selectedAOI.id ? 3 : 2,
                opacity: aoi.id === selectedAOI.id ? 0.8 : 0.5,
                fillOpacity: aoi.id === selectedAOI.id ? 0.2 : 0.1,
              }}
              eventHandlers={{
                click: () => onAOISelect(aoi),
              }}
            />
          </div>
        ))}
      </MapContainer>
    </div>
  );
}