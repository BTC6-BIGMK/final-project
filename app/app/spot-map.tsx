import React, { useEffect, useState, useRef, useCallback } from "react";
import MapView, { Callout, Marker } from "react-native-maps";
import {
  Dimensions,
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";
import Animated from "react-native-reanimated";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppLoading from "expo-app-loading";
import axios from "axios";
import {
  useFonts,
  SawarabiMincho_400Regular,
} from "@expo-google-fonts/sawarabi-mincho";
import { API_ENDPOINT } from "@env";
import LinkButton from "@/components/LinkButton";

export default function SpotMapScreen() {
  const { id, name, lat, lng } = useLocalSearchParams();
  const [spotContents, setSpotContents] = useState<{
    lat: number;
    lng: number;
    name: string;
    image_url: string;
    description: string;
  }>();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  }>();
  console.log("spot", id, name, lat, lng);

  const [arButtonPosition, setArButtonPosition] = useState<number>(52);

  useEffect(() => {
    (async () => {
      const location = await Location.getCurrentPositionAsync({});

      setLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });

      const response = await axios.get(
        // `http://192.168.2.110:3000/api/area-spots/${id}`
        `${API_ENDPOINT}/api/area-spots/${id}`
      );
      setSpotContents(response.data);
    })();
  }, []);

  const { height, width } = Dimensions.get("window");
  const LATITUDE_DELTA = 0.007;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

  const [fontsLoaded] = useFonts({
    SawarabiMincho_400Regular,
  });

  if (!fontsLoaded || spotContents === undefined) {
    return (
      // https://reactnative.dev/docs/activityindicator
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <GestureHandlerRootView>
        {location !== undefined ? (
          <>
            <MapView
              className="flex-1 h-screen"
              showsUserLocation={true}
              initialRegion={{
                latitude: location!.lat - 0.002,
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
          </>
        ) : null}
        {/* ボタン追従仕様に変更予定 */}

        <View className="absolute top-5 left-30 right-0 bottom-0 items-center ">
          <LinkButton link="/spots-map" iconName="map" size={30} />
        </View>
        <View
          style={{
            position: "absolute",
            bottom: `${arButtonPosition}%`,
            right: "4%",
            zIndex: 1,
          }}
        >
          <Link
            href={{
              pathname: "/ar",
              params: {
                id: id,
              },
            }}
            asChild
          >
            <Pressable>
              <Image
                // AR起動 画像変更予定
                source={require("@/assets/images/AR_start.png")}
                style={{ width: 75, height: 75, borderRadius: 8 }}
              />
            </Pressable>
          </Link>
        </View>

        <BottomSheet
          index={1}
          ref={bottomSheetRef}
          snapPoints={["5%", "50%"]}
          handleIndicatorStyle={{
            backgroundColor: "red",
            width: 100,
            height: 6,
            borderRadius: 3,
          }}
          handleComponent={() => {
            return (
              <View>
                <Image
                  style={{
                    width: "100%",
                    height: 20,
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                  }}
                  source={require("@/assets/images/washi.jpeg")}
                />
              </View>
            );
          }}
          onChange={(index) => {
            index === 1 ? setArButtonPosition(52) : setArButtonPosition(7);
          }}
          style={{ zIndex: 4 }}
        >
          <ImageBackground
            source={require("@/assets/images/washi.jpeg")}
            className="flex-1 justify-center z-50"
          >
            <BottomSheetView style={{ paddingLeft: 10 }}>
              <Image
                style={{
                  width: 350,
                  height: 200,
                }}
                src={spotContents!.image_url}
              />
              <Text
                style={{
                  fontFamily: "SawarabiMincho_400Regular",
                  fontSize: 30,
                  fontWeight: "bold",
                }}
              >
                {/* {name} */}
                {spotContents!.name}
              </Text>
              <ScrollView style={{ height: "35%", marginBottom: "7%" }}>
                <Text
                  style={{
                    fontFamily: "SawarabiMincho_400Regular",
                    fontSize: 20,
                  }}
                >
                  {/* 説明文変更予定 */}
                  {spotContents!.description}
                </Text>
              </ScrollView>
            </BottomSheetView>
          </ImageBackground>
        </BottomSheet>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
