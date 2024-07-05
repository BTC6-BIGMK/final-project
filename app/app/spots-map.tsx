import { Pressable, Text, View, Dimensions } from "react-native";
import MapView, { Callout, Marker, UrlTile } from "react-native-maps";
import { useEffect, useState, createRef } from "react";
import * as Location from "expo-location";
import axios from "axios";
import { GeofencingEventType, LocationSubscription } from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import API_ENDPOINT from "@env";

interface Spot {
  spot_id: number;
  name: string;
  lat: number;
  lng: number;
}

const scheduleNotificationAsync = async (spot: {
  id: number;
  identifier: string;
  latitude: number;
  longitude: number;
  radius: number;
}) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "近くにおすすめスポットがあります",
      body: spot.identifier.split(",")[1],
      data: {
        id: spot.id,
        name: spot.identifier,
        lat: spot.latitude,
        lng: spot.longitude,
      },
      sound: "default",
    },
    trigger: {
      seconds: 1,
    },
  });
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

TaskManager.defineTask("GEOFENCE_TASK", ({ data, error }: any) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }
  if (data.eventType === GeofencingEventType.Enter) {
    // TODO: ジオフェンスに入った時の処理を追加
    scheduleNotificationAsync(data.region);
  }
});

function distance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = Math.PI / 180;
  lat1 *= R;
  lng1 *= R;
  lat2 *= R;
  lng2 *= R;
  return (
    1000 *
    6371 *
    Math.acos(
      Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) +
        Math.sin(lat1) * Math.sin(lat2)
    )
  );
}

export default function SpotsMapScreen() {
  const [spots, setSpots] = useState<Spot[]>();
  const [initialLocation, setInitialLocation] = useState<{
    lat: number;
    lng: number;
  }>();

  useEffect(() => {
    (async () => {
      const { status: fStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (fStatus !== "granted") {
        // TODO: 'Permission to access location was denied'
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      setInitialLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      const response = await axios.get(
        // `http://192.168.2.110:3000/api/area-spots?lat=${location.coords.latitude}&lng=${location.coords.longitude}&radius=50000`
        `${API_ENDPOINT}/api/area-spots?lat=${location.coords.latitude}&lng=${location.coords.longitude}&radius=500`
      );
      const spotData = response.data as Spot[];
      setSpots(spotData);
    })();
  }, []);
  const { height, width } = Dimensions.get("window");
  const LATITUDE_DELTA = 0.007;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

  useEffect(() => {
    let locationSubscription: LocationSubscription;
    (async () => {
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 20,
        },
        (loc) => {
          spots?.forEach((spot) => {
            const spotDistance = distance(
              loc.coords.latitude,
              loc.coords.longitude,
              spot.lat,
              spot.lng
            );
            if (spotDistance <= 50) {
              scheduleNotificationAsync({
                id: spot.spot_id,
                identifier: `${spot.spot_id},${spot.name}`,
                latitude: spot.lat,
                longitude: spot.lng,
                radius: 50,
              });
            }
          });
        }
      );
    })();
    return () => locationSubscription.remove();
  }, [spots]);

  return (
    <>
      {spots !== undefined ? (
        <MapView
          className="flex-1 h-screen"
          showsUserLocation={true}
          followsUserLocation={true}
          initialRegion={{
            latitude: initialLocation!!.lat,
            longitude: initialLocation!!.lng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          {spots.map((spot) => (
            <Marker
              key={spot.spot_id}
              pinColor="red"
              coordinate={{ latitude: spot.lat, longitude: spot.lng }}
            >
              <Callout>
                <View>
                  <Text>{spot.name}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      ) : null}
    </>
  );
}
