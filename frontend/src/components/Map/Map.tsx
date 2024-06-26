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
import axios from "axios";

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

interface Spot {
  spot_id: number;
  name: string;
  description: null;
  lat: number;
  lng: number;
}

export const Map = () => {
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: 35.6895014,
    lng: 139.6917337,
  });
  const [spots, setSpots] = useState<Spot[]>();

  const getSuccess = async (pos: GeolocationPosition) => {
    setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    const response = await axios.get(
      `${import.meta.env.VITE_API_ENDPOINT}/api/area-spots?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}&radius=400`,
    );
    setSpots(response.data);
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
      {spots === undefined
        ? null
        : spots.map((ele) => {
            return (
              <Marker
                key={ele.spot_id}
                position={{ lat: ele.lat, lng: ele.lng }}
                icon={spotsBeacon}
              />
            );
          })}
    </MapContainer>
  );
};
