import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    label: string;
    color?: string;
  }>;
  onLocationUpdate?: (lat: number, lng: number) => void;
}

const Map = ({ center = [78.9629, 20.5937], zoom = 5, markers = [], onLocationUpdate }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [tokenInput, setTokenInput] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add markers
      markers.forEach(marker => {
        const el = document.createElement('div');
        el.className = 'w-8 h-8 bg-primary rounded-full border-4 border-white shadow-lg';
        
        new mapboxgl.Marker(el)
          .setLngLat([marker.position[1], marker.position[0]])
          .setPopup(new mapboxgl.Popup().setHTML(`<p class="font-semibold">${marker.label}</p>`))
          .addTo(map.current!);
      });

      // Click to update location if callback provided
      if (onLocationUpdate) {
        map.current.on('click', (e) => {
          onLocationUpdate(e.lngLat.lat, e.lngLat.lng);
        });
      }

      setShowTokenInput(false);
    } catch (error) {
      console.error('Map initialization error:', error);
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, center, zoom, markers, onLocationUpdate]);

  if (showTokenInput) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-muted rounded-lg p-8 space-y-4">
        <div className="text-center space-y-2 max-w-md">
          <h3 className="text-lg font-semibold">Mapbox Token Required</h3>
          <p className="text-sm text-muted-foreground">
            To enable the map, please enter your Mapbox public token. You can get one from{' '}
            <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              mapbox.com
            </a>
          </p>
        </div>
        <div className="w-full max-w-md space-y-2">
          <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
          <Input
            id="mapbox-token"
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="pk.eyJ1..."
            className="font-mono text-sm"
          />
          <Button 
            onClick={() => setMapboxToken(tokenInput)} 
            className="w-full"
            disabled={!tokenInput}
          >
            Load Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
    </div>
  );
};

export default Map;
