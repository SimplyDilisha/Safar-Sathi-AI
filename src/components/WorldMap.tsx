import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface TravelHub {
  name: string;
  lat: number;
  lon: number;
  travelers?: number;
}

const WorldMap = () => {
  // Popular travel destinations
  const travelHubs: TravelHub[] = [
    { name: "New York", lat: 40.7128, lon: -74.006, travelers: 2400 },
    { name: "Paris", lat: 48.8566, lon: 2.3522, travelers: 2800 },
    { name: "Tokyo", lat: 35.6762, lon: 139.6503, travelers: 2100 },
    { name: "Dubai", lat: 25.2048, lon: 55.2708, travelers: 1900 },
    { name: "Sydney", lat: -33.8688, lon: 151.2093, travelers: 1600 },
    { name: "Barcelona", lat: 41.3874, lon: 2.1686, travelers: 1400 },
  ];

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        dragging={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        />
        {travelHubs.map((hub, idx) => (
          <CircleMarker
            key={idx}
            center={[hub.lat, hub.lon]}
            radius={Math.max(5, (hub.travelers || 0) / 200)}
            fillColor="hsl(var(--primary))"
            color="hsl(var(--primary))"
            weight={2}
            opacity={0.8}
            fillOpacity={0.6}
          >
            <Popup>
              <div className="text-xs">
                <div className="font-semibold">{hub.name}</div>
                {hub.travelers && (
                  <div className="text-muted-foreground">
                    {hub.travelers} active travelers
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default WorldMap;
