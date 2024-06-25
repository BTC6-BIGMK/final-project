import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useLayoutEffect } from "react";
import "./beacon.css";

const beacon = L.divIcon({ className: "beacon" });
const spotsBeacon = L.divIcon({ className: "spots-beacon" });

const CurrentLocation = ({
  position,
}: {
  position: { lat: number; lng: number };
}) => {
  const map = useMap();
  useLayoutEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position]);

  return position !== undefined ? (
    <Marker position={position} icon={beacon} />
  ) : null;
};

const testSpots = [
  {
    spot_id: 1,
    name: "常夜燈",
    description: null,
    lat: 35.06860432603339,
    lng: 136.9672798123269,
  },
  {
    spot_id: 2,
    name: "鍾馗様",
    description: null,
    lat: 35.06657084927808,
    lng: 136.9709867265857,
  },
];

export const Map = () => {
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: 35.6895014,
    lng: 139.6917337,
  });

  const getSuccess = (pos: GeolocationPosition) => {
    setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
  };
  useLayoutEffect(() => {
    navigator.geolocation.getCurrentPosition(getSuccess);
  }, []);
  return (
    <MapContainer
      center={[position.lat, position.lng]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "100vh" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CurrentLocation position={position} />
      {testSpots.map((ele) => {
        const position = { lat: ele.lat, lng: ele.lng };
        return <Marker position={position} icon={spotsBeacon} />;
      })}
    </MapContainer>
  );
};
