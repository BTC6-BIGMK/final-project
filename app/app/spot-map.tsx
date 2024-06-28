import { useEffect, useState } from "react";
import MapView, { Callout, Marker } from "react-native-maps";
import { Dimensions, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";

interface Spot {
  spot_id: number;
  name: string;
  lat: number;
  lng: number;
}

export default function SpotMapScreen() {
  const { id, name, lat, lng } = useLocalSearchParams();
  const [spot, setSpot] = useState<Spot>();
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  }>();
  console.log("spot", id, name, lat, lng);

  useEffect(() => {
    (async () => {
      const location = await Location.getCurrentPositionAsync({});

      setLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    })();
  }, []);

  const { height, width } = Dimensions.get("window");
  const LATITUDE_DELTA = 0.007;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

  return (
    <>
      {location !== undefined ? (
        <MapView
          className="flex-1 h-screen"
          showsUserLocation={true}
          followsUserLocation={true}
          initialRegion={{
            latitude: location!.lat,
            longitude: location!.lng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          <Marker
            pinColor="red"
            coordinate={{ latitude: Number(lat), longitude: Number(lng) }}
          >
            <Callout>
              <View>
                <Text>{name}</Text>
              </View>
            </Callout>
          </Marker>
        </MapView>
      ) : null}
    </>
  );
}
