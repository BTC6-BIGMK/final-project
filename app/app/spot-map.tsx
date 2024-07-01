import React, { useEffect, useState, useRef, useCallback } from "react";
import MapView, { Callout, Marker } from "react-native-maps";
import {
  Dimensions,
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";
import Animated from "react-native-reanimated";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppLoading from "expo-app-loading";

import {
  useFonts,
  SawarabiMincho_400Regular,
} from "@expo-google-fonts/sawarabi-mincho";

export default function SpotMapScreen() {
  const { id, name, lat, lng } = useLocalSearchParams();
  const bottomSheetRef = useRef<BottomSheet>(null);

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

  const [fontsLoaded] = useFonts({
    SawarabiMincho_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <>
      <GestureHandlerRootView>
        {location !== undefined ? (
          <>
            <MapView
              className="flex-1 h-screen"
              showsUserLocation={true}
              followsUserLocation={true}
              initialRegion={{
                latitude: location!.lat - 0.001,
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
        <BottomSheet
          index={1}
          ref={bottomSheetRef}
          snapPoints={["3%", "50%"]}
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
                source={require("@/assets/images/dashi.png")}
              />
              <Text
                style={{
                  fontFamily: "SawarabiMincho_400Regular",
                  fontSize: 30,
                  fontWeight: "bold",
                }}
              >
                {name}
              </Text>
              <ScrollView style={{ height: "50%" }}>
                <Text
                  style={{
                    fontFamily: "SawarabiMincho_400Regular",
                    fontSize: 20,
                  }}
                >
                  {/* 説明文変更予定 */}
                  有松の「山車まつり」は明治時代に3輌の山車が各町に備えられてから始まり、午前中に曳行や「車切り」、からくり奉納が行われます。夕方からは提灯を付けた山車が夜囃子と共に町を巡り夜祭をおさめます。
                </Text>
              </ScrollView>
              {/* ボタン配置変更予定 */}
              {/* <View className="items-center">
              // 遷移先修正予定
                <Link href="/AR" asChild>
                  <Pressable>
                    <Image
                    // AR起動 画像変更予定
                      source={require("@/assets/images/AR_start_button.png")}
                      style={{ width: 120, height: 60, borderRadius: 8 }}
                    />
                  </Pressable>
                </Link>
              </View> */}
            </BottomSheetView>
          </ImageBackground>
        </BottomSheet>
      </GestureHandlerRootView>
    </>
  );
}
