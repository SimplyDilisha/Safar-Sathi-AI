import React from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface TravelHub {
	name: string;
	lat: number;
	lon: number;
	travelers?: number;
}

const WorldMap: React.FC = () => {
	const travelHubs: TravelHub[] = [
		{ name: "New York", lat: 40.7128, lon: -74.006, travelers: 2400 },
		{ name: "London", lat: 51.5074, lon: -0.1278, travelers: 3200 },
		{ name: "Paris", lat: 48.8566, lon: 2.3522, travelers: 2800 },
		{ name: "Dubai", lat: 25.2048, lon: 55.2708, travelers: 1900 },
		{ name: "Tokyo", lat: 35.6762, lon: 139.6503, travelers: 2100 },
		{ name: "Sydney", lat: -33.8688, lon: 151.2093, travelers: 1600 },
		{ name: "Bali", lat: -8.4095, lon: 115.1889, travelers: 1800 },
		{ name: "Rio de Janeiro", lat: -22.9068, lon: -43.1729, travelers: 1500 },
	];

	const markerOptions = {
		radius: 6,
		fillColor: "#ff7a2f",
		color: "#fff",
		weight: 2,
		opacity: 1,
		fillOpacity: 0.85,
	} as any;

	return (
		<div className="w-full h-full min-h-[250px] rounded-lg overflow-hidden bg-[#161618] relative z-0">
			<MapContainer
				center={[20, 0]}
				zoom={1.5}
				minZoom={1}
				style={{ height: "100%", width: "100%", background: "#161618" }}
				zoomControl={false}
				scrollWheelZoom={false}
				dragging={true}
				doubleClickZoom={false}
				attributionControl={false}
			>
				<TileLayer
					url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
					attribution='&copy; OpenStreetMap contributors &copy; CARTO'
				/>

				{travelHubs.map((hub, idx) => (
					<CircleMarker
						key={idx}
						center={[hub.lat, hub.lon]}
						pathOptions={markerOptions}
					>
						<Tooltip direction="top" offset={[0, -8]} opacity={1} permanent={false}>
							<div className="text-xs font-semibold text-black px-1">{hub.name}</div>
						</Tooltip>
					</CircleMarker>
				))}
			</MapContainer>
		</div>
	);
};

export default WorldMap;
