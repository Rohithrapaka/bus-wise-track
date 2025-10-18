import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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

// Component to handle map events
function MapEvents({ onLocationUpdate }: { onLocationUpdate?: (lat: number, lng: number) => void }) {
  const map = useMap();

  useEffect(() => {
    if (onLocationUpdate) {
      map.on('click', (e) => {
        onLocationUpdate(e.latlng.lat, e.latlng.lng);
      });
    }

    return () => {
      map.off('click');
    };
  }, [map, onLocationUpdate]);

  return null;
}

// Component to update map center
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
}

const Map = ({ center = [20.5937, 78.9629], zoom = 5, markers = [], onLocationUpdate }: MapProps) => {
  // Create custom marker icons for different colors
  const createCustomIcon = (color?: string) => {
    const markerHtmlStyles = `
      background-color: ${color || '#3b82f6'};
      width: 2rem;
      height: 2rem;
      display: block;
      left: -1rem;
      top: -1rem;
      position: relative;
      border-radius: 2rem 2rem 0;
      transform: rotate(45deg);
      border: 4px solid #fff;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    `;

    return L.divIcon({
      className: "custom-pin",
      iconAnchor: [0, 24],
      popupAnchor: [0, -36],
      html: `<span style="${markerHtmlStyles}" />`
    });
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={zoom}
        className="absolute inset-0 rounded-lg z-0"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={center} />
        <MapEvents onLocationUpdate={onLocationUpdate} />

        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            icon={createCustomIcon(marker.color)}
          >
            <Popup>
              <p className="font-semibold">{marker.label}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
